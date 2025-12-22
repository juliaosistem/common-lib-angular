pipeline {
    agent {
        kubernetes {
            // Sustituye 172.17.0.3 por la IP real interna de tu servidor Ubuntu
            yaml """
            apiVersion: v1
            kind: Pod
            spec:
              hostAliases:
              - ip: "172.17.0.3" 
                hostnames:
                - "nexus.juliaosistem-server.in"
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
            """
        }
    }

    environment {
        NEXUS_DOMAIN = 'nexus.juliaosistem-server.in'
        // Docker Registry: Dominio + Puerto NodePort (Sin paths /repository/...)
        NEXUS_DOCKER_REGISTRY = "${env.NEXUS_DOMAIN}:30500"
        // NPM Registry: URL Completa al Hosted
        NEXUS_NPM_REGISTRY = "http://${env.NEXUS_DOMAIN}:30080/repository/npm-private/"
        
        GIT_CREDS_ID = 'credencialesgit'
        NEXUS_CREDS_ID = 'nexus-credentials'
        RANCHER_CREDS_ID = 'rancher-api-credentials'
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
                        env.PACKAGE_VERSION = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
                    }
                    def commitId = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
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
                    // Usamos la lógica de tu pipeline anterior que tanto te gustaba
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            set -e
                            cd dist/lib-common-angular
                            
                            echo "📤 Preparando publicación de v${CUSTOM_TAG}..."
                            
                            # Calculamos hostpath dinámicamente como en tu versión anterior
                            hostpath=$(echo "$NEXUS_NPM_REGISTRY" | sed -E 's|https?://||; s|/$||')

                            # Creamos el .npmrc (usamos HOME para asegurar persistencia en el stage)
                            printf "registry=%s\n//%s/:_auth=%s\n//%s/:always-auth=true\n" \
                                "$NEXUS_NPM_REGISTRY" \
                                "$hostpath" \
                                "$(printf "%s:%s" "$NEXUS_USER" "$NEXUS_PASS" | base64)" \
                                "$hostpath" > .npmrc

                            # Aplicamos la versión dinámica antes de subir
                            if [ "$BRANCH_NAME" = "master" ]; then
                                npm version patch --no-git-tag-version
                            else
                                npm version ${CUSTOM_TAG} --no-git-tag-version --allow-same-version
                            fi

                            npm publish --userconfig .npmrc
                            echo "✅ Publicación completada en Nexus"
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
                            # Docker necesita el Registry sin protocolos ni paths
                            IMAGE_TAGGED="${NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${CUSTOM_TAG}"
                            
                            echo "$PASS" | docker login --username "$USER" --password-stdin "${NEXUS_DOCKER_REGISTRY}"
                            
                            docker build -t "$IMAGE_TAGGED" .
                            docker push "$IMAGE_TAGGED"
                        '''
                        
                        withCredentials([file(credentialsId: "${RANCHER_CREDS_ID}", variable: 'KUBECONFIG')]) {
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
        failure { echo "❌ El Pipeline falló" }
    }
}