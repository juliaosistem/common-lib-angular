pipeline {
  agent {
    docker {
      image 'docker:24.0'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    NODE_VERSION = 'nodejs'

    // 🔄 Valores estáticos / configurables
    NEXUS_DOCKER_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/docker/'
    NEXUS_NPM_REGISTRY = 'https://nexus.juliaosistem-server.in/repository/npm/'

    NEXUS_CREDENTIALS_ID = 'nexus-credentials'
    RANCHER_CREDENTIALS_ID = 'rancher-api-credentials'
  }

  tools {
    nodejs "${NODE_VERSION}"
  }

  options {
    skipDefaultCheckout()
  }

  stages {
    stage('Check Node Info') {
      steps {
        sh '''
          echo "=== INFORMACIÓN DEL NODO ==="
          which docker || echo "Docker no encontrado"
          docker --version || true
          node --version || true
          npm --version || true
        '''
      }
    }

    stage('Checkout & Info') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
            sh '''
              set -e
              echo "📥 Clonando repo..."
              rm -rf tmp_checkout
              git clone --branch "${BRANCH_NAME:-develop}" "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/common-lib-angular.git" tmp_checkout
              rsync -a --delete --exclude='.git' tmp_checkout/ .
              rm -rf tmp_checkout
            '''
          }

          env.GIT_COMMIT       = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
          env.GIT_COMMIT_SHORT = env.GIT_COMMIT.take(7)
          env.BUILD_TAG        = "${env.BRANCH_NAME ?: 'no-branch'}-${env.BUILD_NUMBER ?: 'no-build'}-${env.GIT_COMMIT_SHORT}"
          env.DEMO_IMAGE_TAG   = "${env.NEXUS_DOCKER_REGISTRY}/lib-common-angular-demo:${env.BUILD_TAG}"
          env.LIB_VERSION      = sh(script: "node -p \"require('./package.json').version\"", returnStdout: true).trim()
        }
      }
    }

    stage('Preparar DTOs') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'credenciales git', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
          sh '''
            rm -rf lib-core-dtos
            git clone --branch develop "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos || \
            git clone "https://${GIT_USER}:${GIT_PASS}@github.com/juliaosistem/lib-core-dtos.git" lib-core-dtos
          '''
        }
      }
    }

    stage('Install dependencies') {
      steps {
        sh '''
          npm install
          npm run generate:dtos
          npm run build:lib
          npm run build:demo
        '''
      }
    }

    stage('Build Library') {
      steps {
        sh 'npm run build:lib'
      }
      post {
        success {
          archiveArtifacts artifacts: 'dist/lib-common-angular/**/*', fingerprint: true
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
        withCredentials([usernamePassword(
          credentialsId: "${NEXUS_CREDENTIALS_ID}",
          usernameVariable: 'NEXUS_USER',
          passwordVariable: 'NEXUS_PASS'
        )]) {
          sh '''
            npm config set registry "$NEXUS_NPM_REGISTRY"
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

    stage('Build Demo App') {
      steps {
        sh 'npm run build:demo'
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
          branch 'master'; branch 'main'; branch 'develop'; branch 'release/*'; branch 'desplieges'
        }
      }
      steps {
        withCredentials([usernamePassword(
          credentialsId: "${NEXUS_CREDENTIALS_ID}",
          usernameVariable: 'NEXUS_USER',
          passwordVariable: 'NEXUS_PASS'
        )]) {
          sh '''
            set -e
            REGISTRY="${NEXUS_DOCKER_REGISTRY%/}"
            IMAGE="${REGISTRY}/lib-common-angular-demo:${BUILD_TAG}"

            echo "🔐 Logueando en registry..."
            docker login --username "$NEXUS_USER" --password-stdin $(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||') <<< "$NEXUS_PASS"

            echo "🔨 Construyendo imagen..."
            docker build -t "${IMAGE}" \
              --build-arg APP_VERSION="${LIB_VERSION}" \
              --build-arg BUILD_TAG="${BUILD_TAG}" \
              --build-arg GIT_COMMIT="${GIT_COMMIT_SHORT}" \
              -f Dockerfile .

            echo "📤 Pushing..."
            docker push "${IMAGE}"
            echo "✅ Imagen publicada: ${IMAGE}"

            docker logout $(echo "${NEXUS_DOCKER_REGISTRY}" | sed -E 's|https?://||; s|/$||') || true
          '''
        }
      }
    }

    stage('Deploy to Production') {
      when { branch 'master' }
      steps {
        withCredentials([string(credentialsId: "${RANCHER_CREDENTIALS_ID}", variable: 'RANCHER_TOKEN')]) {
          sh '''
            echo "🚀 Desplegando ${DEMO_IMAGE_TAG} en Rancher..."
            # lógica de despliegue aquí
          '''
        }
      }
    }

    stage('Deploy entorno de desarrollo') {
      when {
        anyOf { branch 'develop'; branch 'desplieges'; branch 'feature/*' }
      }
      steps {
        echo "🚀 Desplegando en entorno de desarrollo..."
      }
    }
  }

  post {
    always {
      sh '''
        docker system prune -f || true
      '''
      cleanWs()
    }
    success {
      echo "✅ Pipeline Exitoso - ${env.BRANCH_NAME}\n🐳 Docker: ${env.DEMO_IMAGE_TAG}"
    }
    failure {
      echo "❌ Pipeline Falló - ${env.BRANCH_NAME}"
    }
  }
}
