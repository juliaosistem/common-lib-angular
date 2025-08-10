pipeline {
    agent any

    environment {
        NPM_REGISTRY = 'nexus.juliaosistem-server.in/repository/npm/'
        DOCKER_REGISTRY = 'nexus.juliaosistem-server.in/repository/docker/'
        NEXUS_CREDENTIALS = credentials('nexus-credentials')
        BUILD_PROJECT = 'lib-common-angular' // Cambia a 'lib-common-angular-demo' para el demo
        DOCKER_IMAGE_NAME = 'lib-common-angular-demo'
        GIT_BRANCH = "${env.GIT_BRANCH ?: env.BRANCH_NAME}"
        CLEAN_BRANCH = "${GIT_BRANCH.replaceFirst('origin/', '')}"
    }

    options {
        disableConcurrentBuilds()
    }

    stages {
        stage('Valiensual de mensajes de chat. Todavía tiene disponibles finalizaciones de código gratuitas. La asignación se restablecerá el 10 de agosto de 2025dar rama') {
            when {
                not {
                    anyOf {
                        branch 'master'ensual de mensajes de chat. Todavía tiene disponibles finalizaciones de código gratuitas. La asignación se restablecerá el 10 de agosto de 2025
                        branch 'develop'
                        triggeredBy 'UserIdCause'
                    }
                }
            }
            steps {
                script {
                    error("Esta rama solo puede ejecutarse manualmente desde Jenkins.")
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm install'
                    // Siempre construir primero la librería
                    sh 'ng build lib-common-angular'
                        // Luego construir la demo si aplica
                     sh 'ng build lib-common-angular-demo'
                
                    def packageJson = readJSON file: 'package.json'
                    if (env.CLEAN_BRANCH == 'master') {
                        VERSION = packageJson.version
                        DOCKER_TAG = "${VERSION}"
                    } else if (env.CLEAN_BRANCH == 'develop') {
                        VERSION = "develop-${env.BUILD_NUMBER}"
                        DOCKER_TAG = "${VERSION}"
                    } else {
                        VERSION = "${env.CLEAN_BRANCH}-${env.BUILD_NUMBER}"
                        DOCKER_TAG = "${VERSION}"
                    }
                    echo "Versión determinada: ${VERSION}"
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (env.BUILD_PROJECT == 'lib-common-angular-demo') {
                        sh 'ng test lib-common-angular-demo --watch=false --browsers=ChromeHeadless'
                    } else {
                        sh 'ng test lib-common-angular --watch=false --browsers=ChromeHeadless'
                    }
                }
            }
        }

        stage('Publish npm package') {
            when {
                expression { env.BUILD_PROJECT == 'lib-common-angular' }
            }
            steps {
                script {
                    sh "npm publish --registry=https://${NPM_REGISTRY}"
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { env.BUILD_PROJECT == 'lib-common-angular-demo' }
            }
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}${DOCKER_IMAGE_NAME}:${DOCKER_TAG}", ".")
                }
            }
        }

        stage('Push Docker to Nexus') {
            when {
                expression { env.BUILD_PROJECT == 'lib-common-angular-demo' }
            }
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", NEXUS_CREDENTIALS) {
                        docker.image("${DOCKER_REGISTRY}${DOCKER_IMAGE_NAME}:${DOCKER_TAG}").push()
                    }
                }
            }
        }

        stage('Deploy to Rancher/K8s') {
            when {
                allOf {
                    anyOf {
                        branch 'master'
                        branch 'develop'
                    }
                    expression { env.BUILD_PROJECT == 'lib-common-angular-demo' && env.CHANGE_ID == null }
                }
            }
            steps {
                script {
                    sh "kubectl set image deployment/${DOCKER_IMAGE_NAME} ${DOCKER_IMAGE_NAME}=${DOCKER_REGISTRY}${DOCKER_IMAGE_NAME}:${DOCKER_TAG} -n tu-namespace"
                    // registerDeploy() si tienes función para registrar despliegue
                }
            }
        }
    }

    post {
        success {
            echo "Despliegue exitoso de ${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
        }
        failure {
            echo "Error en el pipeline"
        }
    }
}