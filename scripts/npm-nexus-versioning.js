import { execSync } from 'child_process';

const BRANCH_ENV_KEYS = [
  'OPENSHIP_BRANCH',
  'OPENSHIP_GIT_BRANCH',
  'OPENSHIP_REF',
  'CI_COMMIT_REF_NAME',
  'CI_COMMIT_BRANCH',
  'CI_BRANCH',
  'GITLAB_CI_COMMIT_REF_NAME',
  'GIT_BRANCH',
  'BITBUCKET_BRANCH',
  'BRANCH_NAME',
  'GITHUB_REF_NAME'
];

export function normalizeBranchName(raw) {
  return String(raw || '')
    .trim()
    .toLowerCase()
    .replace(/^refs\/heads\//, '')
    .split('/')
    .pop();
}

export function normalizeGitSha(raw) {
  const value = String(raw || '').trim();
  const timestampedBuild = value.match(/^(.+-\d{8})[.]\d{6}(?:-\d+)?$/);
  return timestampedBuild ? timestampedBuild[1] : value;
}

function commandExists(cmd) {
  try {
    execSync(`command -v ${cmd} >/dev/null 2>&1`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function inferBranchFromProjectName(env) {
  const projectLike = env.OPENSHIP_PROJECT || env.OPENSHIP_PROJECT_NAME || env.OPENSHIP_PROJECT_SLUG || '';
  if (!projectLike) {
    return '';
  }

  const tail = normalizeBranchName(projectLike.split('-').pop());
  if (!tail) {
    return '';
  }

  return /^[a-z0-9._-]{2,80}$/.test(tail) ? tail : '';
}

function detectBranchFromGit() {
  if (!commandExists('git')) {
    return '';
  }

  try {
    let branchName = execSync('git log -n 1 --pretty=%d HEAD')
      .toString()
      .replace(/[()]/g, '')
      .split(',')
      .map(s => s.trim())
      .find(s => s.startsWith('origin/'))
      ?.replace('origin/', '') || '';

    if (!branchName) {
      branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    }

    return normalizeBranchName(branchName);
  } catch {
    return '';
  }
}

export function resolveBranchName({
  env = process.env,
  strict = false,
  fallback = 'desplieges'
} = {}) {
  let branchName = '';

  for (const key of BRANCH_ENV_KEYS) {
    branchName = normalizeBranchName(env[key]);
    if (branchName) {
      return { branchName, source: `env:${key}` };
    }
  }

  branchName = detectBranchFromGit();
  if (branchName) {
    return { branchName, source: 'git' };
  }

  branchName = inferBranchFromProjectName(env);
  if (branchName) {
    return { branchName, source: 'project-name' };
  }

  branchName = normalizeBranchName(env.OPENSHIP_BRANCH_FALLBACK || env.DEFAULT_BRANCH_FALLBACK || fallback);
  if (branchName) {
    if (strict) {
      throw new Error('No se pudo detectar rama de CI/git y STRICT_BRANCH_DETECTION=true impide usar fallback.');
    }
    return { branchName, source: 'fallback' };
  }

  throw new Error('No se pudo detectar rama ni fallback. Configura OPENSHIP_BRANCH o OPENSHIP_BRANCH_FALLBACK.');
}

export function resolveGitSha({ env = process.env } = {}) {
  const direct = env.OPENSHIP_COMMIT_SHA || env.CI_COMMIT_SHORT_SHA || env.GIT_SHA || '';
  if (direct && direct !== 'unknown') {
    return normalizeGitSha(direct);
  }

  if (commandExists('git')) {
    try {
      return normalizeGitSha(execSync('git rev-parse --short=7 HEAD').toString());
    } catch {
      // Continue to timestamp fallback below.
    }
  }

  return Math.floor(Date.now() / 1000).toString(16);
}

export function resolveNpmDeployConfig({ baseVersion, branchName, gitSha }) {
  const isReleaseBranch = branchName === 'master' || branchName === 'main';

  if (isReleaseBranch) {
    return {
      isReleaseBranch,
      targetRepository: 'npm-releases',
      npmRepoUrl: 'https://nexus.twincode.site/repository/npm-releases/',
      finalNpmVersion: baseVersion
    };
  }

  return {
    isReleaseBranch,
    targetRepository: 'npm-snapshots',
    npmRepoUrl: 'https://nexus.twincode.site/repository/npm-snapshots/',
    finalNpmVersion: `${baseVersion}-${branchName}-${gitSha}`
  };
}

/** Incrementa el segmento patch de un semver "x.y.z" (ignora sufijos -pre/+build). */
export function bumpPatchVersion(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) {
    throw new Error(`Versión "${version}" no tiene formato semver x.y.z para incrementar.`);
  }
  const [, major, minor, patch] = match;
  return `${major}.${minor}.${Number(patch) + 1}`;
}
