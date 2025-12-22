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
        NEXUS_DOCKER_REGISTRY = "${env.NEXUS_DOMAIN}:30500"
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

                    // 1. Extraemos la versión real del package.json usando un contenedor de node
                    container('nodejs') {
                        env.PACKAGE_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                    }

                    // 2. Obtenemos el commit corto
                    def commitId = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    
                    // 3. Construimos el tag: version-rama-build-commit
                    // Ejemplo: 1.2.0-desplieges-8-a9f38f7
                    env.CUSTOM_TAG = "${env.PACKAGE_VERSION}-${BRANCH_NAME}-${BUILD_ID}-${commitId}"
                    
                    echo "🏷️ Versión base detectada: ${env.PACKAGE_VERSION}"
                    echo "🏷️ Tag final generado: ${env.CUSTOM_TAG}"
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

        stage('Publish Master (Stable)') {
            when { branch 'master' }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            npm config set registry ${NEXUS_NPM_HOSTED}
                            npm version patch -m "Release stable: %s [skip ci]"
                            npm publish
                        '''
                    }
                }
            }
        }

        stage('Publish Develop/Desplieges (Dev)') {
            when { anyOf { branch 'develop'; branch 'desplieges' } }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            cd dist/lib-common-angular
                            # Ahora CUSTOM_TAG es 0.0.0-rama-id-hash, lo cual es válido
                            npm version ${CUSTOM_TAG} --no-git-tag-version --allow-same-version
                            npm publish --registry ${NEXUS_NPM_HOSTED}
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
                        
                        // Actualización en Rancher
                        withCredentials([file(credentialsId: 'kubeconfig-rancher', variable: 'KUBECONFIG')]) {
                            sh "export KUBECONFIG=${KUBECONFIG}"
                            sh "kubectl set image deployment/demo-angular-app demo=${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${CUSTOM_TAG} -n develop"
                            sh "kubectl rollout status deployment/demo-angular-app -n develop"
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
        success {
            echo "✅ Pipeline exitoso: ${env.CUSTOM_TAG}"
        }
        failure {
            echo "❌ El Pipeline falló en la rama ${BRANCH_NAME}"
        }
    }
}