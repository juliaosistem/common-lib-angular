pipeline {
    agent {
        kubernetes {
            yaml '''
            apiVersion: v1
            kind: Pod
            spec:
              securityContext:
                runAsUser: 0
              containers:
              - name: nodejs
                image: node:20-alpine
                command: ['cat']
                tty: true
                volumeMounts:
                - name: node-cache
                  mountPath: /root/.npm
                resources:
                  limits: { memory: "4Gi", cpu: "2000m" }
                  requests: { memory: "2Gi", cpu: "1000m" }
              - name: docker
                image: docker:24-cli
                command: ['cat']
                tty: true
                volumeMounts:
                - name: dockersock
                  mountPath: /var/run/docker.sock
              volumes:
              - name: dockersock
                hostPath: { path: /var/run/docker.sock }
              - name: node-cache
                persistentVolumeClaim:
                  claimName: node-pvc
            '''
        }
    }

    environment {
        NEXUS_DOMAIN = 'nexus.juliaosistem-server.in'
        // Puerto 30500 mapeado al 5000 del hosted docker
        NEXUS_DOCKER_REGISTRY = "${env.NEXUS_DOMAIN}:30500"
        // Puerto 30080 mapeado al 8081 de Nexus
        NEXUS_NPM_HOSTED = "http://${env.NEXUS_DOMAIN}:30080/repository/npm-private/"
        
        GIT_CREDS_ID = 'credencialesgit'
        NEXUS_CREDS_ID = 'nexus-credentials'
    }

    options {
        skipDefaultCheckout() 
        timeout(time: 1, unit: 'HOURS')
    }

    stages {
        stage('Checkout & Tagging') {
            steps {
                script {
                    sh "rm -rf ./* ./.* || true"
                    
                    withCredentials([usernamePassword(credentialsId: "${GIT_CREDS_ID}", usernameVariable: 'U', passwordVariable: 'P')]) {
                        sh """
                            git clone --depth 1 --branch ${BRANCH_NAME} https://${U}:${P}@github.com/juliaosistem/common-lib-angular.git .
                            git clone --depth 1 https://${U}:${P}@github.com/juliaosistem/lib-core-dtos.git lib-core-dtos
                        """
                    }

                    container('nodejs') {
                        // Leemos la versión base del package.json
                        env.PACKAGE_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                    }

                    def commitId = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    // Tag SemVer compatible: 0.0.1-desplieges-8-abc123
                    env.CUSTOM_TAG = "${env.PACKAGE_VERSION}-${BRANCH_NAME}-${BUILD_ID}-${commitId}"
                    
                    echo "🏷️ Tag generado: ${env.CUSTOM_TAG}"
                }
            }
        }    

        stage('Build Angular') {
            steps {
                container('nodejs') {
                    sh '''
                        apk add --no-cache git
                        npm ci --prefer-offline --no-audit
                        npm run generate:dtos
                        npm run build:lib
                        npm run build:demo
                    '''
                }
            }
        }

        stage('Publish to Nexus NPM') {
            when { anyOf { branch 'master'; branch 'develop'; branch 'desplieges' } }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            cd dist/lib-common-angular
                            
                            # Generamos el token de autenticación Base64 para Nexus
                            AUTH_64=$(echo -n "${USER}:${PASS}" | base64)
                            # Extraemos el host sin http:// para el archivo .npmrc
                            REGISTRY_HOST="nexus.juliaosistem-server.in:30080/repository/npm-private/"

                            # Creamos el archivo .npmrc local para autorizar la publicación
                            echo "registry=http://${REGISTRY_HOST}" > .npmrc
                            echo "//${REGISTRY_HOST}:_auth=${AUTH_64}" >> .npmrc
                            echo "//${REGISTRY_HOST}:always-auth=true" >> .npmrc

                            if [ "$BRANCH_NAME" = "master" ]; then
                                npm version patch -m "Release stable: %s [skip ci]"
                            else
                                npm version ${CUSTOM_TAG} --no-git-tag-version --allow-same-version
                            fi
                            
                            npm publish --userconfig .npmrc
                        '''
                    }
                }
            }
        }

        stage('Docker Push & Deploy') {
            when { anyOf { branch 'develop'; branch 'desplieges'; branch 'master' } }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            IMAGE_TAGGED="${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${CUSTOM_TAG}"
                            
                            echo "$PASS" | docker login --username "$USER" --password-stdin "${NEXUS_DOCKER_REGISTRY}"
                            
                            docker build -t "$IMAGE_TAGGED" .
                            docker push "$IMAGE_TAGGED"
                        '''
                        
                        // Actualización automática en Rancher (Deployment: demo-angular-app)
                        withCredentials([file(credentialsId: 'rancher-api-credentials', variable: 'KUBECONFIG')]) {
                            sh """
                                export KUBECONFIG=${KUBECONFIG}
                                kubectl set image deployment/demo-angular-app demo=${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${CUSTOM_TAG} -n develop
                                kubectl rollout status deployment/demo-angular-app -n develop
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs() 
            echo "🏁 Proceso terminado para: ${env.CUSTOM_TAG}"
        }
        success { echo "✅ Pipeline exitoso: ${env.CUSTOM_TAG}" }
        failure { echo "❌ El Pipeline falló en la rama ${BRANCH_NAME}" }
    }
}