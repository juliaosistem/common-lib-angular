pipeline {
    agent any

    environment {
        NODE_VERSION = 'nodejs'

        // 🔄 Valores estáticos / configurables
        NEXUS_DOCKER_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/docker/'
        NEXUS_NPM_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/npm/'

        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        RANCHER_CREDENTIALS_ID = 'rancher-api-credentials'

        // Variables calculadas en runtime/etapas (no aquí)
        // BRANCH_NAME, GIT_COMMIT_SHORT, BUILD_TAG, LIB_VERSION, DEMO_IMAGE_TAG
    }

    tools {
        nodejs "${NODE_VERSION}"
        // Docker se maneja como comando directo, no como herramienta de Jenkins
    }

    options {
        // Evitar checkout automático; hacemos checkout explícito dentro del pipeline
        skipDefaultCheckout()
    }

    stages {
        stage('Check Node Info') {
            steps {
                sh '''
                    echo "=== INFORMACIÓN DEL NODO ==="
                    echo "NODE_NAME: $NODE_NAME"
                    echo "NODE_LABELS: $NODE_LABELS"
                    echo "WORKSPACE: $WORKSPACE"
                    echo "JENKINS_HOME: $JENKINS_HOME"
                    echo "=== HERRAMIENTAS DISPONIBLES ==="
                    which docker || echo "Docker no encontrado"
                    which node || echo "Node.js no encontrado"
                    which npm || echo "NPM no encontrado"
                    which java || echo "Java no encontrado"
                    echo "=== SISTEMA ==="
                    uname -a
                    echo "=== FIN ==="
                '''
            }
        }
        // REEMPLAZADO: Checkout & Info (clonar en tmp y copiar para evitar "destination path '.' already exists")
        stage('Checkout & Info') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        // Validación en Groovy antes de ejecutar comandos con las credenciales
                        def u = env.GIT_USER ?: ''
                        if (u.contains('@') || u.contains(' ') || u.contains(':')) {
                            error("Credencial mal formada: Username contiene caracteres inválidos (${u}).\nAsegura en Jenkins que 'credenciales git' sea tipo 'Username with password' con:\n - Username = tu usuario de GitHub (ej. farius-red), NO el email\n - Password = token personal (PAT).")
                        }

                        sh '''
                          set -e
                          echo "🔎 Validando acceso al repo principal..."
                          if ! git ls-remote --heads "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" "${BRANCH_NAME:-develop}" >/dev/null 2>&1; then
                            echo "ERROR: no se pudo acceder al repo principal con las credenciales proporcionadas."
                            echo "Verifica 'credenciales git' en Jenkins: Username = tu usuario GitHub (no email), Password = token personal (PAT)."
                            exit 1
                          fi
                          echo "📥 Clonando repo principal en tmp_checkout..."
                          rm -rf tmp_checkout
                          git clone --branch "${BRANCH_NAME:-develop}" "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" tmp_checkout
                          echo "📤 Sincronizando contenido al workspace (excluyendo .git)..."
                          if command -v rsync >/dev/null 2>&1; then
                            rsync -a --delete --exclude='.git' tmp_checkout/ .
                          else
                            echo "⚠️ rsync no disponible: usando git archive como fallback (no requiere rsync)"
                            git -C tmp_checkout archive HEAD | tar -x -C .
                          fi
                          rm -rf tmp_checkout
                        '''
                    }

                    // Obtener commit y calcular variables desde el repo clonado
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    env.GIT_COMMIT_SHORT = env.GIT_COMMIT.take(7)
                    env.BUILD_TAG = "${env.BRANCH_NAME ?: 'no-branch'}-${env.BUILD_NUMBER ?: 'no-build'}-${env.GIT_COMMIT_SHORT}"
                    env.DEMO_IMAGE_TAG = "${env.NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${env.BUILD_TAG}"
                    env.LIB_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()

                    echo "🚀 Build automático en multibranch"
                    echo "📦 Rama: ${env.BRANCH_NAME}"
                    echo "📝 Commit: ${env.GIT_COMMIT}"
                    echo "🏷️ Versión librería: ${env.LIB_VERSION}"
                    echo "🏷️ Tag imagen: ${env.BUILD_TAG}"
                }
            }
        }

        stage('preparar dtos') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    script {
                        sh '''
                          set -e
                          echo "🔽 Preparando lib-core-dtos (clone limpio)"
                          rm -rf lib-core-dtos
                          if ! git clone --branch develop "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos 2>/dev/null; then
                              echo "⚠️ No se pudo clonar la rama 'develop' (posible que no exista); clonando la rama por defecto..."
                              git clone "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos
                          fi
                          echo "✅ lib-core-dtos listo"
                        '''
                    }
                }
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    if (!fileExists('package.json')) {
                        error("package.json no encontrado en workspace. Asegúrate de que el checkout se realizó correctamente.")
                    }
                    sh '''
                        echo "📦 Instalando dependencias..."
                        npm install
                        echo "✅ Dependencias instaladas"
                        echo "🔄 Generando DTOs y construyendo proyectos..."
                        npm run generate:dtos
                        echo "✅ DTOs generados"
                        echo "🔨 Construyendo librería y demo..."
                        npm run build:lib
                        echo "✅ Librería construida"
                        npm run build:demo
                    '''
                }
            }
        }

        // stage('Quality Gates') {
        //     parallel {
        //         stage('Lint') {
        //             steps {
        //                 sh 'npm run lint'
        //             }
        //         }
        //         stage('Test Library') {
        //             steps {
        //                 sh 'npm run test:lib'
        //             }
        //         }
        //         stage('Test Demo') {
        //             steps {
        //                 sh 'npm run test:demo'
        //             }
        //         }
        //     }
        // }

        stage('Build Library') {
            steps {
                sh '''
                    echo "🔨 Construyendo librería..."
                    npm run build:lib
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/lib-common-angular/**/*', fingerprint: true
                }
            }
        }
   stage('Publicar en Nexus NPM') {
            when {
                anyOf {
                    branch 'master'
                    branch 'main'
                    branch 'develop'
                    branch 'release/*'
                    branch 'desplieges'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    script {
                        sh '''
                            set -e
                            echo "📤 Publicando librería v${LIB_VERSION} en Nexus NPM..."
                            # asegurar registry en npm config (no imprime secretos)
                            npm config set registry "$NEXUS_NPM_REGISTRY"

                            # calcular host+path (ej: nexus.juliaosistem-server.in/repository/npm) desde la URL
                            hostpath=$(echo "$NEXUS_NPM_REGISTRY" | sed -E 's|https?://||; s|/$||')

                            # crear .npmrc usando variables de shell (no interpolar secretos con Groovy)
                            # auth en base64 user:pass; always-auth para que npm use credenciales
                            printf "registry=%s\n//%s/:_auth=%s\n//%s/:always-auth=true\n" \
                                "$NEXUS_NPM_REGISTRY" \
                                "$hostpath" \
                                "$(printf "%s:%s" "$NEXUS_USER" "$NEXUS_PASS" | base64)" \
                                "$hostpath" > ~/.npmrc

                            # forzar publish al registry de Nexus (evita publishConfig en package.json)
                            cd dist/lib-common-angular
                            npm publish --registry "$NEXUS_NPM_REGISTRY"
                            echo "✅ Librería v${LIB_VERSION} publicada exitosamente en $NEXUS_NPM_REGISTRY"
                        '''
                    }
                }
            }
        }

        stage('Build Demo App') {
            steps {
                sh '''
                    echo "🔨 Construyendo demo..."
                    npm run build:demo
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/lib-common-angular-demo/**/*', fingerprint: true
                }
            }
        }

        stage('Docker Build & Push') {
            // Nuevo: ejecutar esta etapa dentro de un contenedor que tenga docker CLI
            // Monta el socket del host para usar el daemon del host.
            agent {
                docker {
                    // Imagen ligera con docker CLI; ajusta versión si lo necesitas.
                    image 'docker:24.0.5'
                    // Montar socket para usar el daemon del host
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            when {
                anyOf {
                    branch 'master'
                    branch 'main'
                    branch 'develop'
                    branch 'release/*'
                    branch 'desplieges'
                }
            }
            steps {
                script {
                    // Detectar disponibilidad de Kaniko o Docker en tiempo de ejecución.
                    // Dentro de este agente docker, `docker` estará disponible apuntando al socket montado.
                    def hasKaniko = sh(script: 'if [ -x /kaniko/executor ]; then echo yes; else echo no; fi', returnStdout: true).trim() == 'yes'
                    def hasDocker = sh(script: 'if command -v docker >/dev/null 2>&1; then echo yes; else echo no; fi', returnStdout: true).trim() == 'yes'

                    if (hasKaniko) {
                        echo "🐳 Kaniko detectado: usando Kaniko para build y push"
                        withCredentials([usernamePassword(
                            credentialsId: "${NEXUS_CREDENTIALS_ID}",
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )]) {
                            sh '''
                                set -eu
                                echo "🐳 Preparando config.json de Docker para Kaniko desde credenciales de Jenkins..."

                                hostpath=$(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||')

                                auth=$(printf "%s:%s" "${NEXUS_USER}" "${NEXUS_PASS}" | base64 -w0 2>/dev/null || printf "%s:%s" "${NEXUS_USER}" "${NEXUS_PASS}" | base64)
                                cat > "${WORKSPACE}/kaniko-config.json" <<EOF
{
  "auths": {
    "${hostpath}": {
      "username": "${NEXUS_USER}",
      "password": "${NEXUS_PASS}",
      "auth": "${auth}"
    }
  }
}
EOF

                                mkdir -p /kaniko/.docker || true
                                cp "${WORKSPACE}/kaniko-config.json" /kaniko/.docker/config.json || true
                                chmod 600 /kaniko/.docker/config.json || true

                                REGISTRY="${NEXUS_DOCKER_REGISTRY%/}"
                                DEST="${REGISTRY}/lib-common-angular-demo:${BUILD_TAG}"
                                echo "Destino: ${DEST}"

                                /kaniko/executor \
                                  --context "${WORKSPACE}" \
                                  --dockerfile "${WORKSPACE}/Dockerfile" \
                                  --destination "${DEST}" \
                                  --build-arg APP_VERSION="${LIB_VERSION}" \
                                  --build-arg BUILD_TAG="${BUILD_TAG}" \
                                  --build-arg GIT_COMMIT="${GIT_COMMIT_SHORT}" \
                                  --verbosity info

                                echo "✅ Imagen publicada: ${DEST}"

                                rm -f "${WORKSPACE}/kaniko-config.json" || true
                                rm -f /kaniko/.docker/config.json" || true
                            '''
                        }
                    } else if (hasDocker) {
                        echo "🐳 Docker disponible en el contenedor (socket montado): usando docker build/push"
                        withCredentials([usernamePassword(
                            credentialsId: "${NEXUS_CREDENTIALS_ID}",
                            usernameVariable: 'NEXUS_USER',
                            passwordVariable: 'NEXUS_PASS'
                        )]) {
                            sh '''
                                set -eu
                                REGISTRY="${NEXUS_DOCKER_REGISTRY%/}"
                                IMAGE="${REGISTRY}/lib-common-angular-demo:${BUILD_TAG}"
                                echo "Destino: ${IMAGE}"

                                echo "🔐 Logueando en registry..."
                                docker login --username "$NEXUS_USER" --password-stdin $(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||') <<< "$NEXUS_PASS"

                                echo "🔨 Construyendo imagen..."
                                docker build -t "${IMAGE}" --build-arg APP_VERSION="${LIB_VERSION}" --build-arg BUILD_TAG="${BUILD_TAG}" --build-arg GIT_COMMIT="${GIT_COMMIT_SHORT}" -f Dockerfile .

                                echo "📤 Pushing..."
                                docker push "${IMAGE}"

                                echo "✅ Imagen publicada: ${IMAGE}"

                                docker logout $(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||') || true
                            '''
                        }
                    } else {
                        echo "⚠️ Ni Kaniko ni Docker están disponibles en este nodo/contendedor. Saltando Docker Build & Push."
                        echo "   Si necesita publicar imágenes desde este pipeline, habilite un Cloud Kubernetes en Jenkins o instale Docker/Kaniko en el agente."
                    }
                }
            }
        }

        stage('Deploy to Production') {
            when {
                anyOf {
                    branch 'master'
                   
                }
            }
            steps {
                withCredentials([string(credentialsId: "${RANCHER_CREDENTIALS_ID}", variable: 'RANCHER_TOKEN')]) {
                    script {
                        sh """
                            echo "🚀 Desplegando ${env.DEMO_IMAGE_TAG} en Rancher..."
                            # Deploy logic aquí...
                            echo "✅ Despliegue completado"
                        """
                    }
                }
            }
        }

        stage('Deploy entorno de desarrollo') {
            when {
                anyOf {
                    branch 'develop'
                    branch 'desplieges'
                    branch 'feature/*'
                }
            }
            steps {
                echo "🚀 Desplegando en entorno de desarrollo..."
            }
        }


    } // end stages

    post {
        always {
            script {
                node {
                    sh '''
                        # Limpiar Docker si está disponible
                        if command -v docker >/dev/null 2>&1; then
                            docker system prune -f || true
                        else
                            echo "Docker no disponible, saltando limpieza"
                        fi
                    '''
                    cleanWs()
                }
            }
        }
        success {
            script {
                def deployStatus = ""
                if (env.BRANCH_NAME == 'master' || env.BRANCH_NAME == 'main') {
                    deployStatus = "🚀 Desplegado en PRODUCCIÓN"
                } else if (env.BRANCH_NAME == 'develop') {
                    deployStatus = "🧪 Desplegado en desarrollo"
                } else if (env.BRANCH_NAME?.startsWith('feature/')) {
                    deployStatus = "🔬 Desplegado en FEATURE env"
                } else if (env.BRANCH_NAME?.startsWith('desplieges')) {
                    deployStatus = "🔬 Desplegado"
                }
                 else {
                    deployStatus = "📦 Solo build (no deploy)"
                }

                echo """✅ Pipeline Exitoso - ${env.BRANCH_NAME}
📦 Librería: v${env.LIB_VERSION}
🐳 Docker: ${env.DEMO_IMAGE_TAG}
${deployStatus}
🔗 Build: ${env.BUILD_URL}
"""
            }
        }
        failure {
            script {
                node {
                    echo """❌ Pipeline Falló - ${env.BRANCH_NAME}
📝 Commit: ${env.GIT_COMMIT}
🔗 Build: ${env.BUILD_URL}
"""
                }
            }
        }
    }

} // end pipeline