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

    stages {
        stage('Checkout & Tagging') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: "${GIT_CREDS_ID}", usernameVariable: 'U', passwordVariable: 'P')]) {
                        sh "git clone --branch ${BRANCH_NAME} https://$U:$P@github.com/juliaosistem/common-lib-angular.git ."
                    }
                    def commitId = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    
                    // Lógica de nombres solicitada: rama-build-commit
                    env.CUSTOM_TAG = "${BRANCH_NAME}-${BUILD_ID}-${commitId}"
                    echo "🏷️ Tag generado: ${env.CUSTOM_TAG}"
                }
            }
        }

        stage('Build') {
            steps {
                container('nodejs') {
                    sh '''
                        apk add --no-cache git
                        npm ci --prefer-offline
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
                        script {
                            // En master subimos versión real (patch) y creamos tag en Git
                            sh '''
                                npm config set registry ${NEXUS_NPM_HOSTED}
                                # Sube versión oficial (ej: 1.0.1 -> 1.0.2)
                                npm version patch -m "Release stable: %s [skip ci]"
                                npm publish
                            '''
                            // Aquí podrías añadir git push para el tag si lo deseas
                        }
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
                            # Usamos el nombre solicitado: desplieges-12-gefe45
                            npm version ${CUSTOM_TAG} --no-git-tag-version
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
                        
                        // Automatización: Actualiza Rancher instantáneamente
                        withCredentials([file(credentialsId: 'kubeconfig-rancher', variable: 'KUBECONFIG')]) {
                            sh "export KUBECONFIG=${KUBECONFIG}"
                            sh "kubectl set image deployment/demo-angular-app demo=${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${CUSTOM_TAG} -n develop"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Borra el código del agente para no llenar el disco
            echo "🏁 Finalizado proceso para: ${env.CUSTOM_TAG}"
        }
        success {
            echo "✅ Pipeline exitoso: ${env.CUSTOM_TAG}"
        }
        failure {
            echo "❌ Pipeline falló en la rama ${BRANCH_NAME}"
        }
    }
}