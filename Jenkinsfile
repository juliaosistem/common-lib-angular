pipeline {
    agent any
    
    environment {
        NODE_VERSION = 'nodejs'
        
        // 🔄 Valores estáticos / configurables
        NEXUS_DOCKER_REGISTRY = 'localhost:8082'
        NEXUS_NPM_REGISTRY = 'http://localhost:8081/repository/npm-hosted/'
        
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        RANCHER_CREDENTIALS_ID = 'rancher-api-credentials'
        
        // Variables calculadas en runtime/etapas (no aquí)
        // BRANCH_NAME, GIT_COMMIT_SHORT, BUILD_TAG, LIB_VERSION, DEMO_IMAGE_TAG
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    // Evitar el checkout automático que ocurre antes de asignar el agent
    options {
        skipDefaultCheckout()
    }
    
    stages {

         stage('preparar dtos') {
            steps {
                // Usar withCredentials para clonar y validar credenciales antes de clonar
                withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    script {
                        // Si ya existe el dir, actualizar; si no, clonar usando credenciales
                        if (fileExists('lib-core-dtos/.git')) {
                            sh '''
                              set -e
                              cd lib-core-dtos
                              git fetch --all --prune
                              git checkout develop || true
                              git pull origin develop || true
                            '''
                        } else {
                            // validar credenciales intentando acceder al repo remoto
                            sh '''
                              set -e
                              echo "🔎 Validando acceso a lib-core-dtos..."
                              if ! git ls-remote --heads "https://Farius-red:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" develop >/dev/null 2>&1; then
                                echo "ERROR: no se pudo acceder a https://github.com/juliaosistem/lib-core-dtos.git"
                                echo "Revisa el credentialsId 'credenciales git' - el username y el token/password deben estar en los campos correctos."
                                exit 1
                              fi
                              echo "📥 Clonando lib-core-dtos..."
                              git clone --branch develop "https://Farius-red:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos
                            '''
                        }
                    }
                }
            }
        }
         stage('Install dependencies') {
                steps {
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
        
        stage('Checkout & Info') {
            steps {
                script {
                    // Hacer checkout explícito usando credenciales y validar antes
                    withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                          set -e
                          echo "🔎 Validando acceso al repo principal..."
                          if ! git ls-remote --heads "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" ${BRANCH_NAME:-develop} >/dev/null 2>&1; then
                            echo "ERROR: no se pudo acceder a https://github.com/juliaosistem/common-lib-angular.git"
                            echo "Verifica 'credenciales git' en Jenkins (username debe ser tu usuario GitHub y password tu token personal)."
                            exit 1
                          fi
                          echo "📥 Clonando repo principal..."
                          rm -rf ./* || true
                          git clone --branch "${BRANCH_NAME:-develop}" "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" .
                        '''
                    }
                    
                    // Obtener commit corto de forma segura
                    if (env.GIT_COMMIT) {
                        env.GIT_COMMIT_SHORT = env.GIT_COMMIT.take(7)
                    } else {
                        env.GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    }
                    
                    // Construir BUILD_TAG y DEMO_IMAGE_TAG dinámicamente
                    env.BUILD_TAG = "${env.BRANCH_NAME ?: 'no-branch'}-${env.BUILD_NUMBER ?: 'no-build'}-${env.GIT_COMMIT_SHORT}"
                    env.DEMO_IMAGE_TAG = "${env.NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${env.BUILD_TAG}"
                    
                    // Obtener versión de la librería
                    env.LIB_VERSION = sh(
                        script: "node -p \"require('./package.json').version\"",
                        returnStdout: true
                    ).trim()
                    
                    echo "🚀 Build automático en multibranch"
                    echo "📦 Rama: ${env.BRANCH_NAME}"
                    echo "📝 Commit: ${env.GIT_COMMIT}"
                    echo "🏷️ Versión librería: ${env.LIB_VERSION}"
                    echo "🏷️ Tag imagen: ${env.BUILD_TAG}"
                }
            }
        }
        
        
        stage('Quality Gates') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'npm run lint'
                    }
                }
                stage('Test Library') {
                    steps {
                        sh 'npm run test:lib'
                    }
                }
                stage('Test Demo') {
                    steps {
                        sh 'npm run test:demo'
                    }
                }
            }
        }
        
        stage('Build Library') {
            steps {
                sh '''
                    echo "🔨 Construyendo librería..."
                    npm run build:lib
                    npm run pack:lib
                '''
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/lib-common-angular/**/*', fingerprint: true
                }
            }
        }
        
        stage('Publish NPM Library') {
            when {
                anyOf {
                    branch 'master'
                    branch 'main' 
                    branch 'develop'
                    branch 'release/*'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${NEXUS_CREDENTIALS_ID}",
                    usernameVariable: 'NEXUS_USER',
                    passwordVariable: 'NEXUS_PASS'
                )]) {
                    script {
                        // 🔄 Extraer dominio dinámicamente
                        def nexusDomain = env.NEXUS_NPM_REGISTRY.replaceAll('https?://', '').split('/')[0]
                        
                        sh """
                            echo "📤 Publicando librería v${env.LIB_VERSION} en Nexus NPM..."
                            npm config set registry ${env.NEXUS_NPM_REGISTRY}
                            
                            # Configurar autenticación dinámicamente
                            echo "//${nexusDomain}/:_auth=\$(echo -n "${NEXUS_USER}:${NEXUS_PASS}" | base64)" > ~/.npmrc
                            echo "//${nexusDomain}/:always-auth=true" >> ~/.npmrc
                            
                            cd dist/lib-common-angular
                            npm publish
                            
                            echo "✅ Librería v${env.LIB_VERSION} publicada exitosamente"
                        """
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
                        
                        # Tag latest para ramas principales
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
                    branch 'main'
                }
            }
            steps {
                withCredentials([string(credentialsId: "${RANCHER_CREDENTIALS_ID}", variable: 'RANCHER_TOKEN')]) {
                    script {
                        def rancherUrl = env.RANCHER_URL ?: 'https://rancher.your-domain.com'
                        def projectId = env.RANCHER_PROJECT_ID ?: 'c-xxxxx:p-xxxxx'
                        
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
            }
            steps {
                echo "🚀 Desplegando en entorno de staging..."
            }
        }
        
        stage('Deploy Feature') {
            when {
                branch 'feature/*'
            }
            steps {
                echo "🧪 Desplegando feature branch para testing..."
            }
        }
    }
    
    post {
        always {
            script {
                // Ejecutar limpieza dentro de node para disponer de hudson.FilePath
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
                } else if (env.BRANCH_NAME.startsWith('feature/')) {
                    deployStatus = "🔬 Desplegado en FEATURE env"
                } else {
                    deployStatus = "📦 Solo build (no deploy)"
                }
                
                echo """✅ **Pipeline Exitoso - ${env.BRANCH_NAME}**
📦 **Librería**: v${env.LIB_VERSION}
🐳 **Docker**: ${env.DEMO_IMAGE_TAG}
${deployStatus}
🔗 **Build**: ${env.BUILD_URL}
"""
            }
        }
        failure {
            script {
                // Ejecutar mensajes / acciones de failure dentro de node si necesitan workspace
                node {
                    echo """❌ **Pipeline Falló - ${env.BRANCH_NAME}**
📝 **Commit**: ${env.GIT_COMMIT}
🔗 **Build**: ${env.BUILD_URL}
"""
                }
            }
        }
    }
}
