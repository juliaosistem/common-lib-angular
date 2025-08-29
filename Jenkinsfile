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
    }

    options {
        // Evitar checkout automático; hacemos checkout explícito dentro del pipeline
        skipDefaultCheckout()
    }

    stages {

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
            when {
                anyOf {
                    branch 'master'
                    branch 'main'
                    branch 'develop'
                    branch 'release/*'
                    branch 'desplieges/*'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    sh '''
                        echo "🐳 Construyendo imagen Docker..."
                        docker build -t ${DEMO_IMAGE_TAG} .
                        echo "🔐 Login a Nexus Docker Registry..."
                        echo "${NEXUS_PASS}" | docker login ${NEXUS_DOCKER_REGISTRY} -u "${NEXUS_USER}" --password-stdin
                        echo "📤 Pushing imagen..."
                        docker push ${DEMO_IMAGE_TAG}
                        if [ "${BRANCH_NAME}" = "master" ] || [ "${BRANCH_NAME}" = "main" ]; then
                            docker tag ${DEMO_IMAGE_TAG} ${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:latest
                            docker push ${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:latest
                        fi
                        echo "✅ Imagen publicada: ${DEMO_IMAGE_TAG}"
                    '''
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

        stage('Deploy to Staging') {
            when {
                branch 'develop'
                branch 'desplieges/*'
            }
            steps {
                echo "🚀 Desplegando en entorno de staging..."
            }
        }

        stage('Deploy Feature') {
            when {
                branch 'feature/*'
                branch 'desplieges/*'
            }
            steps {
                echo "🧪 Desplegando feature branch para testing..."
            }
        }

    } // end stages

    post {
        always {
            script {
                node {
                    sh 'docker system prune -f || true'
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
                    deployStatus = "🧪 Desplegado en STAGING"
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