pipeline {
    agent any
    
    environment {
        NODE_VERSION = 'nodejs'
        
        // 🔄 Usar variables de entorno de Jenkins (más seguro)
        NEXUS_DOCKER_REGISTRY = "${env.NEXUS_DOCKER_REGISTRY ?: 'localhost:8082'}"
        NEXUS_NPM_REGISTRY = "${env.NEXUS_NPM_REGISTRY ?: 'http://localhost:8081/repository/npm-hosted/'}"
        
        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        RANCHER_CREDENTIALS_ID = 'rancher-api-credentials'
        
        // 🌳 Variables automáticas en multibranch
        BRANCH_NAME = "${env.BRANCH_NAME}"
        GIT_COMMIT_SHORT = "${env.GIT_COMMIT.take(7)}"
        BUILD_TAG = "${BRANCH_NAME}-${env.BUILD_NUMBER}-${GIT_COMMIT_SHORT}"
        LIB_VERSION = ""
        DEMO_IMAGE_TAG = "${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${BUILD_TAG}"
    }
    
    tools {
        nodejs "${NODE_VERSION}"
    }
    
    stages {

         stage('preparar dtos') {
            steps {
                // usa credenciales con usuario/password configuradas en Jenkins (id: 'credenciales git')
                withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                        
                        echo "🔽 Preparando lib-core-dtos (branch: develop)"
                        
                        # Si existe submodulo, actualizar; si no, clonar directamente
                        if [ -d "lib-core-dtos/.git" ]; then
                          echo "📁 lib-core-dtos existe: actualizando..."
                          cd lib-core-dtos
                          git fetch --all --prune
                          git checkout develop || true
                          git pull origin develop || true
                          cd ..
                        else
                          echo "📥 Clonando lib-core-dtos desde GitHub..."
                         git clone --branch develop https://zigmainflables@gmail.com:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git lib-core-dtos
                        fi
                        
                        echo "✅ lib-core-dtos listo"
                    '''
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
                    // 🔄 En multibranch, checkout es automático
                     
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
            sh 'docker system prune -f || true'
            cleanWs()
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
    sh '''echo "❌ **Pipeline Falló - ''' + env.BRANCH_NAME + '''**"
        echo "📝 **Commit**: ''' + env.GIT_COMMIT + '''"
        echo "🔗 **Build**: ''' + env.BUILD_URL + '''"'''
        }
}

}
