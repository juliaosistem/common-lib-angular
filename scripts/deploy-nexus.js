import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { resolveBranchName, resolveGitSha, resolveNpmDeployConfig, bumpPatchVersion } from './npm-nexus-versioning.js';

function shellEscapeSingleQuotes(value) {
  return String(value).replace(/'/g, `'"'"'`);
}

function tagExists(tagName) {
  try {
    return execSync(`git tag -l "${tagName}"`, { encoding: 'utf8' }).trim() === tagName;
  } catch {
    return false;
  }
}

/**
 * Reporta un GitHub Commit Status (best-effort). Usa la API legacy de Statuses
 * porque funciona con un PAT normal (la API de Checks exige GitHub App).
 */
let commitStatusReported = false;
function reportCommitStatus(state, description, targetUrl) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return;
  try {
    const repoSlug = resolveRepoSlug();
    const fullSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const payload = JSON.stringify({
      state,
      context: 'openship/deploy-nexus',
      description: description.slice(0, 140),
      ...(targetUrl ? { target_url: targetUrl } : {})
    });
    execSync(
      `curl -s -o /dev/null -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github+json" ` +
        `https://api.github.com/repos/${repoSlug}/statuses/${fullSha} -d '${payload.replace(/'/g, `'"'"'`)}'`
    );
    if (state === 'success' || state === 'failure' || state === 'error') {
      commitStatusReported = true;
    }
  } catch {
    // best-effort: un fallo al reportar el status no debe tumbar el deploy.
  }
}

process.on('exit', () => {
  if (!commitStatusReported) {
    reportCommitStatus('failure', 'deploy-nexus.js terminó sin completar el pipeline.');
  }
});

/** Extrae "owner/repo.git" desde package.json.repository.url (soporta https/git). */
function resolveRepoSlug() {
  const url = JSON.parse(fs.readFileSync('./package.json', 'utf8')).repository?.url || '';
  const match = url.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git)?$/);
  if (!match) {
    throw new Error(`No se pudo resolver owner/repo desde repository.url: "${url}"`);
  }
  return match[1];
}

/**
 * Tras publicar un release en Nexus (rama master/main): etiqueta el commit con
 * la versión publicada y adelanta develop a la siguiente versión patch, igual
 * que en lib-core-dtos. Idempotente vía el tag existente.
 */
function tagReleaseAndBumpDevelop({ releasedVersion }) {
  const tagName = `v${releasedVersion}`;
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    console.warn('⚠️ GITHUB_TOKEN no configurado: se omite el tag de release y el bump de develop.');
    return;
  }
  if (tagExists(tagName)) {
    console.log(`ℹ️ El tag ${tagName} ya existe; se omite tag y bump (commit ya procesado).`);
    return;
  }

  const repoSlug = resolveRepoSlug();
  const remote = `https://x-access-token:${token}@github.com/${repoSlug}.git`;

  console.log(`🏷️  Creando tag ${tagName} para el release publicado...`);
  execSync(`git tag -a "${tagName}" -m "Release ${tagName}"`, { stdio: 'inherit' });
  execSync(`git push "${remote}" "${tagName}"`, { stdio: 'inherit' });

  const nextVersion = bumpPatchVersion(releasedVersion);
  console.log(`📈 Adelantando develop a la versión ${nextVersion}...`);
  execSync('git fetch --quiet origin develop', { stdio: 'inherit' });
  execSync('git checkout -B develop origin/develop', { stdio: 'inherit' });

  for (const file of ['package.json', 'package-lock.json']) {
    if (!fs.existsSync(file)) continue;
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    json.version = nextVersion;
    if (json.packages?.['']) json.packages[''].version = nextVersion;
    fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
  }

  execSync('git add package.json package-lock.json', { stdio: 'inherit' });
  execSync(
    `git -c user.name="Openship CI" -c user.email="ci@twincode.site" commit -m "chore(release): bump develop a ${nextVersion} tras publicar ${tagName} [skip ci]"`,
    { stdio: 'inherit' }
  );
  execSync(`git push "${remote}" HEAD:develop`, { stdio: 'inherit' });
  console.log(`✅ develop actualizado a ${nextVersion} y tag ${tagName} publicado.`);
}

function runCurlWithBody(cmd, errorLabel) {
  const output = execSync(`${cmd} -w "\\nHTTP_STATUS:%{http_code}\\n"`, { encoding: 'utf8' });
  const match = output.match(/\nHTTP_STATUS:(\d{3})\s*$/);
  const status = match ? Number(match[1]) : 0;
  const body = output.replace(/\nHTTP_STATUS:\d{3}\s*$/, '').trim();

  if (!status || status >= 400) {
    throw new Error(`${errorLabel} (HTTP ${status || 'desconocido'})${body ? `: ${body}` : ''}`);
  }

  return { status, body };
}

// =============================================
// 1. RAMA + VERSIÓN
// =============================================
const strictBranchDetection = String(process.env.STRICT_BRANCH_DETECTION || 'false').toLowerCase() === 'true';
const { branchName, source: branchSource } = resolveBranchName({
  env: process.env,
  strict: strictBranchDetection,
  fallback: 'desplieges'
});
const gitSha = resolveGitSha({ env: process.env });
if (branchSource !== 'git' && !branchSource.startsWith('env:')) {
  console.warn(`⚠️ Rama no encontrada por CI/Git; usando ${branchSource}: ${branchName}`);
}

const NEXUS_USER = process.env.NEXUS_USER;
const NEXUS_PASS = process.env.NEXUS_PASS;
if (!NEXUS_USER || !NEXUS_PASS) {
  throw new Error('❌ Faltan credenciales NEXUS_USER/NEXUS_PASS en variables de entorno.');
}

const baseVersion = JSON.parse(fs.readFileSync('./package.json', 'utf8')).version || '0.0.1';
const outputDir = '.dist/npm-package';
const outputAbs = path.resolve(outputDir);

const { targetRepository, npmRepoUrl, finalNpmVersion, isReleaseBranch } = resolveNpmDeployConfig({
  baseVersion,
  branchName,
  gitSha
});

console.log(`🚀 Iniciando despliegue npm-only de lib-common-angular en rama [${branchName}]`);
console.log(`📦 NPM Version: ${finalNpmVersion}`);
reportCommitStatus('pending', `Publicando ${finalNpmVersion} en Nexus...`);

// =============================================
// 2. BUILD DE LA LIBRERÍA (ng-packagr)
// =============================================
if (String(process.env.SKIP_BUILD || 'false').toLowerCase() !== 'true') {
  console.log('🔧 Compilando lib-common-angular (ng-packagr)...');
  execSync('npm run build:lib', { stdio: 'inherit' });
} else {
  console.warn('⚠️ SKIP_BUILD=true. Se omite build de librería.');
}

// =============================================
// 3. VERSIONAR Y EMPAQUETAR dist/lib-common-angular
// =============================================
const distDir = path.resolve('dist/lib-common-angular');
const distPkgPath = path.join(distDir, 'package.json');
if (!fs.existsSync(distPkgPath)) {
  throw new Error('❌ No se encontró dist/lib-common-angular/package.json tras el build. Revisa el paso build:lib.');
}
const distPkg = JSON.parse(fs.readFileSync(distPkgPath, 'utf8'));
distPkg.version = finalNpmVersion;
distPkg.publishConfig = { registry: npmRepoUrl };
fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));
console.log('✅ package.json de dist actualizado con versión y registry de publicación.');

fs.rmSync(outputAbs, { recursive: true, force: true });
fs.mkdirSync(outputAbs, { recursive: true });

console.log('📦 Empaquetando tarball npm...');
const packRaw = execSync(`npm pack "${distDir}" --pack-destination "${outputDir}" --json`, { encoding: 'utf8' });
const packInfo = JSON.parse(packRaw);
const tgzFile = Array.isArray(packInfo) && packInfo[0]?.filename;
if (!tgzFile) {
  throw new Error('❌ No se pudo empaquetar el tarball .tgz');
}
const tgzPath = path.join(outputDir, tgzFile);
console.log(`📦 Archivo empaquetado listo en: ${tgzPath}`);

// =============================================
// 4. PUBLICAR EN NEXUS NPM (sin JAR: esta librería es solo Angular/TS)
// =============================================
try {
  console.log(`📤 Subiendo paquete NPM a Nexus [${targetRepository}]...`);
  const uploadCmd = `curl -k -sS -u '${shellEscapeSingleQuotes(NEXUS_USER)}:${shellEscapeSingleQuotes(NEXUS_PASS)}' -X POST "https://nexus.twincode.site/service/rest/v1/components?repository=${targetRepository}" -F "npm.asset=@${tgzPath}"`;
  runCurlWithBody(uploadCmd, '❌ Error crítico en la subida NPM a la API de Nexus');
  console.log('✅ Paquete NPM publicado correctamente en Nexus vía API.');
} catch (npmError) {
  console.error('❌ Error crítico en la subida a la API de Nexus:', npmError.message);
  throw npmError;
}

// =============================================
// 5. TAG DE RELEASE + BUMP DE DEVELOP (solo master/main)
// =============================================
if (isReleaseBranch) {
  try {
    tagReleaseAndBumpDevelop({ releasedVersion: baseVersion });
  } catch (tagError) {
    console.error('⚠️ El release se publicó, pero falló el tag/bump automático:', tagError.message);
  }
}

reportCommitStatus(
  'success',
  `Publicado en Nexus: npm ${finalNpmVersion}`,
  `https://nexus.twincode.site/#browse/browse:${targetRepository}`
);
console.log('🎉 ¡Despliegue completo y exitoso!');
