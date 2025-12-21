pipeline {
    agent {
        kubernetes {
            // Definimos el Pod con los contenedores necesarios y el montaje del socket de Docker
            yaml '''
            apiVersion: v1
            kind: Pod
            metadata:
              labels:
                app: jenkins-agent-builder
            spec:
              # Ejecutamos como root para evitar problemas de permisos con el socket
              securityContext:
                runAsUser: 0
                fsGroup: 0
              containers:
              # 1. Contenedor para Node/Angular (Builds)
              - name: nodejs
                image: node:20-alpine
                command: ['cat']
                tty: true
                resources:
                  limits:
                    memory: "2Gi"
                    cpu: "1000m"
                  requests:
                    memory: "1Gi"
                    cpu: "500m"
                    
              # 2. Contenedor para Docker CLI (Build de Imagen)
              - name: docker
                image: docker:24-cli
                command: ['cat']
                tty: true
                volumeMounts:
                - name: dockersock
                  mountPath: /var/run/docker.sock
              
              # Montamos el socket del host físico dentro del Pod
              volumes:
              - name: dockersock
                hostPath:
                  path: /var/run/docker.sock
            '''
        }
    }

    environment {
        // 🔄 Valores estáticos / configurables
        NEXUS_DOCKER_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/docker/'
        NEXUS_NPM_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/npm/'

        NEXUS_CREDENTIALS_ID = 'nexus-credentials'
        RANCHER_CREDENTIALS_ID = 'rancher-api-credentials'

        // Forzar salida con colores
        FORCE_COLOR = '1'
        NPM_CONFIG_COLOR = 'always'
    }

    options {
        skipDefaultCheckout()
        // Establecer un timeout por seguridad
        timeout(time: 1, unit: 'HOURS') 
    }

    stages {
        stage('Checkout & Info') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'credencialesgit', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        
                        // Validación rápida de credenciales
                        def u = env.GIT_USER ?: ''
                        if (u.contains('@')) {
                            error("Credencial mal formada: El usuario contiene '@'. Usa tu usuario de GitHub, no el correo.")
                        }

                        sh '''
                          set -e
                          echo "🔎 Validando acceso al repo principal..."
                          # Limpiar workspace previo si existe
                          rm -rf tmp_checkout
                          
                          echo "📥 Clonando repo..."
                          git clone --branch "${BRANCH_NAME:-develop}" "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" tmp_checkout
                          
                          echo "📤 Sincronizando..."
                          # Usamos cp -r si rsync no está disponible (alpine base a veces no tiene rsync)
                          cp -r tmp_checkout/. .
                          rm -rf tmp_checkout
                        '''

                        env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        env.GIT_COMMIT_SHORT = env.GIT_COMMIT.take(7)
                        env.BUILD_TAG = "${env.BRANCH_NAME ?: 'no-branch'}-${env.BUILD_NUMBER ?: 'no-build'}-${env.GIT_COMMIT_SHORT}"
                        env.DEMO_IMAGE_TAG = "${env.NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${env.BUILD_TAG}"
                        
                        // Usamos el contenedor nodejs solo para leer el package.json
                        container('nodejs') {
                            env.LIB_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                        }

                        echo "🚀 Build automático en multibranch"
                        echo "📦 Rama: ${env.BRANCH_NAME}"
                        echo "📝 Commit: ${env.GIT_COMMIT}"
                        echo "🏷️ Versión librería: ${env.LIB_VERSION}"
                        echo "🏷️ Tag imagen: ${env.BUILD_TAG}"
                    }
                }
            }
        }

        stage('Preparar dependencias (Git)') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    script {
                        sh '''
                          set -e
                          echo "🔽 Clonando lib-core-dtos..."
                          rm -rf lib-core-dtos
                          if ! git clone --branch develop "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos 2>/dev/null; then
                              echo "⚠️ Rama develop no encontrada, clonando default..."
                              git clone "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos
                          fi
                        '''
                    }
                }
            }
        }

        stage('Install & Build (Angular)') {
            steps {
                // EJECUTAMOS DENTRO DEL CONTENEDOR NODEJS
                container('nodejs') {
                    script {
                        if (!fileExists('package.json')) {
                            error("package.json no encontrado.")
                        }
                        
                        // Asegurar que git esté instalado en alpine si npm lo necesita para dependencias
                        sh 'apk add --no-cache git || true'

                        sh '''
                            echo "📦 Configurando NPM..."
                            # Configuración de registro y colores
                            npm config set registry "https://registry.npmjs.org/"
                            npm config set color always || true
                            export FORCE_COLOR=1

                            echo "📦 Instalando dependencias..."
                            npm install

                            echo "🔄 Generando DTOs..."
                            npm run generate:dtos
                            
                            echo "🔨 Construyendo librería..."
                            npm run build:lib
                            
                            echo "🔨 Construyendo demo..."
                            npm run build:demo
                        '''
                    }
                }
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/lib-common-angular/**/*', fingerprint: true
                    archiveArtifacts artifacts: 'dist/lib-common-angular-demo/**/*', fingerprint: true
                }
            }
        }

        stage('Publicar en Nexus NPM') {
            when {
                anyOf {
                    branch 'master'; branch 'main'; branch 'develop'; branch 'release/*'; branch 'desplieges'
                }
            }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        script {
                            sh '''
                                set -e
                                echo "📤 Publicando librería v${LIB_VERSION}..."
                                
                                # Configurar auth Nexus
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
        }

        stage('Docker Build & Push') {
            when {
                anyOf {
                    branch 'master'; branch 'main'; branch 'develop'; branch 'release/*'; branch 'desplieges'
                }
            }
            steps {
                // EJECUTAMOS DENTRO DEL CONTENEDOR DOCKER
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDENTIALS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        script {
                            sh '''
                                set -eu
                                echo "🐳 Iniciando Docker Build..."
                                
                                # Limpiar URL para login
                                REGISTRY_URL=$(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||')
                                REGISTRY_CLEAN="${NEXUS_DOCKER_REGISTRY%/}"
                                
                                IMAGE="${REGISTRY_CLEAN}/lib-common-angular-demo:${BUILD_TAG}"
                                
                                echo "🔐 Login en $REGISTRY_URL..."
                                echo "$NEXUS_PASS" | docker login --username "$NEXUS_USER" --password-stdin "$REGISTRY_URL"

                                echo "🔨 Building $IMAGE..."
                                docker build -t "${IMAGE}" \
                                    --build-arg APP_VERSION="${LIB_VERSION}" \
                                    --build-arg BUILD_TAG="${BUILD_TAG}" \
                                    --build-arg GIT_COMMIT="${GIT_COMMIT_SHORT}" \
                                    -f Dockerfile .

                                echo "📤 Pushing..."
                                docker push "${IMAGE}"
                                
                                echo "✅ Docker Push exitoso"
                            '''
                        }
                    }
                }
            }
        }

        stage('Deploy to Rancher') {
            when { branch 'master' }
            steps {
                container('nodejs') { // O un contenedor con kubectl/rancher-cli si lo necesitas
                     withCredentials([string(credentialsId: "${RANCHER_CREDENTIALS_ID}", variable: 'RANCHER_TOKEN')]) {
                        sh 'echo "🚀 Implementar lógica de despliegue aquí (kubectl set image / helm upgrade)..."'
                    }
                }
            }
        }
    } // end stages

    post {
        always {
            script {
                // Limpieza básica
                cleanWs()
            }
        }
        success {
            script {
               echo "✅ Pipeline completado exitosamente para ${env.BRANCH_NAME}"
            }
        }
        failure {
            script {
               echo "❌ Pipeline falló en ${env.BRANCH_NAME}"
            }
        }
    }
}