pipeline {
    agent {
        kubernetes {
            // Definimos el Pod con los contenedores necesarios
            yaml '''
            apiVersion: v1
            kind: Pod
            metadata:
              labels:
                app: jenkins-agent-builder
            spec:
              securityContext:
                runAsUser: 0
                fsGroup: 0
              containers:
              # 1. Contenedor para Node/Angular (Subimos a 4Gi para evitar OOM en Angular)
              - name: nodejs
                image: node:20-alpine
                command: ['cat']
                tty: true
                resources:
                  limits:
                    memory: "4Gi"
                    cpu: "1000m"
                  requests:
                    memory: "2Gi"
                    cpu: "500m"
                    
              # 2. Contenedor para Docker CLI
              - name: docker
                image: docker:24-cli
                command: ['cat']
                tty: true
                volumeMounts:
                - name: dockersock
                  mountPath: /var/run/docker.sock
              
              volumes:
              - name: dockersock
                hostPath:
                  path: /var/run/docker.sock
            '''
        }
    }

    environment {
        // 🔄 URLs de tus repositorios en Nexus
        NEXUS_DOCKER_REGISTRY = 'nexus.juliaosistem-server.in:5000' // Puerto del hosted docker
        NEXUS_NPM_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/npm-private/'
        
        // IDs de credenciales unificados (como en tus capturas)
        GIT_CREDS_ID = 'credencialesgit'
        NEXUS_CREDS_ID = 'nexus-credentials'
        RANCHER_CREDS_ID = 'rancher-api-credentials'

        FORCE_COLOR = '1'
    }

    options {
        skipDefaultCheckout()
        timeout(time: 1, unit: 'HOURS') 
    }

    stages {
        stage('Checkout & Info') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${GIT_CREDS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        sh '''
                          set -e
                          echo "🔎 Limpiando y clonando repo principal..."
                          rm -rf *
                          git clone --branch "${BRANCH_NAME}" "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" .
                        '''

                        env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        env.GIT_COMMIT_SHORT = env.GIT_COMMIT.take(7)
                        env.BUILD_TAG = "${BRANCH_NAME}-${BUILD_NUMBER}-${env.GIT_COMMIT_SHORT}"
                        
                        container('nodejs') {
                            env.LIB_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                        }
                    }
                }
            }
        }

        stage('Preparar dependencias (Git)') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${GIT_CREDS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh '''
                      set -e
                      echo "🔽 Clonando lib-core-dtos..."
                      rm -rf lib-core-dtos
                      git clone "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos
                    '''
                }
            }
        }

        stage('Install & Build (Angular)') {
            steps {
                container('nodejs') {
                    sh '''
                        echo "📦 Instalando git para dependencias npm..."
                        apk add --no-cache git
                        
                        echo "📦 Instalando dependencias..."
                        npm ci 

                        echo "🔨 Construyendo core libDto..."}
                        npm run generate:dtos
                        
                        echo "🔨 Construyendo librería..."
                        npm run build:lib
                        
                        echo "🔨 Construyendo demo..."
                        npm run build:demo
                    '''
                }
            }
        }

        stage('Publicar en Nexus NPM') {
            when { branch 'develop' } // Ajusta según tu flujo
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            set -e
                            hostpath=$(echo "$NEXUS_NPM_REGISTRY" | sed -E 's|https?://||; s|/$||')
                            printf "registry=%s\n//%s/:_auth=%s\n//%s/:always-auth=true\n" \
                                "$NEXUS_NPM_REGISTRY" \
                                "$hostpath" \
                                "$(printf "%s:%s" "$NEXUS_USER" "$NEXUS_PASS" | base64)" \
                                "$hostpath" > ~/.npmrc

                            cd dist/lib-common-angular
                            npm publish --registry "$NEXUS_NPM_REGISTRY"
                        '''
                    }
                }
            }
        }

        stage('Docker Build & Push') {
            when { branch 'develop' }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            set -eu
                            IMAGE="${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${BUILD_TAG}"
                            
                            echo "🔐 Login en Nexus Docker..."
                            echo "$NEXUS_PASS" | docker login --username "$NEXUS_USER" --password-stdin "${NEXUS_DOCKER_REGISTRY}"

                            echo "🔨 Building $IMAGE..."
                            docker build -t "${IMAGE}" .

                            echo "📤 Pushing..."
                            docker push "${IMAGE}"
                        '''
                    }
                }
            }
        }

        stage('Deploy to Rancher') {
            when { branch 'develop' }
            steps {
                withCredentials([string(credentialsId: "${RANCHER_CREDS_ID}", variable: 'RANCHER_TOKEN')]) {
                    echo "🚀 Disparando despliegue en Rancher para: ${BUILD_TAG}"
                    // Aquí puedes usar una imagen con kubectl o curl para avisar a Rancher
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "✅ Pipeline exitoso: ${env.BUILD_TAG}"
        }
        failure {
            echo "❌ Pipeline falló"
        }
    }
}