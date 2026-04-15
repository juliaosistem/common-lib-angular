pipeline {
    agent {
        kubernetes {
            // Usamos tu IP 192.168.1.254 para que el Pod encuentre a Nexus localmente
            yaml """
            apiVersion: v1
            kind: Pod
            spec:
              hostAliases:
              - ip: "192.168.1.254"
                hostnames:
                                - "nexus.twincode.site"
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
                                    claimName: maven-pvc
            """
        }
    }

    environment {
        NEXUS_DOMAIN = 'nexus.twincode.site'
        NEXUS_NPM_SNAPSHOTS = 'https://nexus.twincode.site/repository/npm-snapshots/'
        NEXUS_NPM_HOSTED = 'https://nexus.twincode.site/repository/npm-hosted/'
        NEXUS_DOCKER_REGISTRY = 'nexus.twincode.site:5000'
        
        GIT_CREDS_ID = 'credencialesgit'
        NEXUS_CREDS_ID = 'nexus-credentials'
        RANCHER_CREDS_ID = 'rancher-api-credentials'
    }

    parameters {
        booleanParam(
            name: 'DEPLOY_DEMO_DOCKER',
            defaultValue: false,
            description: 'Publicar imagen Docker de la demo y desplegarla en Rancher.'
        )
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
                    // Tag SemVer: version-rama-build-commit
                    env.CUSTOM_TAG = "${env.PACKAGE_VERSION}-${BRANCH_NAME}-${BUILD_ID}-${commitId}"
                    echo "🏷️ Tag generado: ${env.CUSTOM_TAG}"
                }
            }
        }    

        stage('Build Library') {
            steps {
                container('nodejs') {
                    sh '''
                        apk add --no-cache git
                        npm ci --prefer-offline --no-audit
                        npm run generate:dtos
                        npm run build:lib
                    '''
                }
            }
        }

        stage('Publish to Nexus NPM') {
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                    branch 'desplieges'
                }
            }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            set -e
                            cd dist/lib-common-angular

                            if [ "$BRANCH_NAME" = "master" ]; then
                                TARGET_NPM_REGISTRY="$NEXUS_NPM_HOSTED"
                            else
                                TARGET_NPM_REGISTRY="$NEXUS_NPM_SNAPSHOTS"
                            fi

                            AUTH_TOKEN=$(printf "%s:%s" "$NEXUS_USER" "$NEXUS_PASS" | base64)
                              AUTH_REGISTRY=$(echo "$TARGET_NPM_REGISTRY" | sed -E 's#^https?://##')
                            cat > .npmrc <<EOF
registry=$TARGET_NPM_REGISTRY
//$AUTH_REGISTRY:_auth=$AUTH_TOKEN
//$AUTH_REGISTRY:always-auth=true
EOF

                            # Versionado
                            if [ "$BRANCH_NAME" = "master" ]; then
                                npm version patch --no-git-tag-version
                              else
                                  npm version "$CUSTOM_TAG" --no-git-tag-version --allow-same-version
                            fi

                            npm publish --userconfig .npmrc
                        '''
                    }
                }
            }
        }

        stage('Verify Package In Nexus') {
            when {
                anyOf {
                    branch 'master'
                    branch 'develop'
                    branch 'desplieges'
                }
            }
            steps {
                container('nodejs') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'NEXUS_USER', passwordVariable: 'NEXUS_PASS')]) {
                        sh '''
                            set -e
                              cd dist/lib-common-angular
                            if [ "$BRANCH_NAME" = "master" ]; then
                                TARGET_NPM_REGISTRY="$NEXUS_NPM_HOSTED"
                            else
                                TARGET_NPM_REGISTRY="$NEXUS_NPM_SNAPSHOTS"
                            fi

                              AUTH_TOKEN=$(printf "%s:%s" "$NEXUS_USER" "$NEXUS_PASS" | base64)
                              AUTH_REGISTRY=$(echo "$TARGET_NPM_REGISTRY" | sed -E 's#^https?://##')
                              cat > .npmrc <<EOF
registry=$TARGET_NPM_REGISTRY
//$AUTH_REGISTRY:_auth=$AUTH_TOKEN
//$AUTH_REGISTRY:always-auth=true
EOF

                            npm view lib-common-angular version --registry "$TARGET_NPM_REGISTRY" >/dev/null
                            echo "Paquete lib-common-angular verificado en $TARGET_NPM_REGISTRY"
                        '''
                    }
                }
            }
        }

        stage('Build Demo') {
            when {
                allOf {
                    expression { return params.DEPLOY_DEMO_DOCKER }
                    anyOf {
                        branch 'master'
                        branch 'develop'
                        branch 'desplieges'
                    }
                }
            }
            steps {
                container('nodejs') {
                    sh 'npm run build:demo'
                }
            }
        }

        stage('Docker Push & Deploy Demo') {
            when {
                allOf {
                    expression { return params.DEPLOY_DEMO_DOCKER }
                    anyOf {
                        branch 'master'
                        branch 'develop'
                        branch 'desplieges'
                    }
                }
            }
            steps {
                container('docker') {
                    withCredentials([usernamePassword(credentialsId: "${NEXUS_CREDS_ID}", usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        sh '''
                            set -e
                            IMAGE_TAGGED="$NEXUS_DOCKER_REGISTRY/lib-common-angular-demo:$CUSTOM_TAG"
                            echo "$PASS" | docker login --username "$USER" --password-stdin "$NEXUS_DOCKER_REGISTRY"
                            docker build -t "$IMAGE_TAGGED" .
                            docker push "$IMAGE_TAGGED"
                        '''
                    }
                    withCredentials([file(credentialsId: "${RANCHER_CREDS_ID}", variable: 'KUBECONFIG')]) {
                        sh '''
                            set -e
                            export KUBECONFIG="$KUBECONFIG"
                            kubectl set image deployment/demo-angular-app demo=$NEXUS_DOCKER_REGISTRY/lib-common-angular-demo:$CUSTOM_TAG -n develop
                            kubectl rollout status deployment/demo-angular-app -n develop
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs() 
            echo "🏁 Proceso terminado: ${env.CUSTOM_TAG}"
        }
    }
}