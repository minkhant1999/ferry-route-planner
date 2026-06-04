pipeline {
  agent any

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    IMAGE_NAME = 'ferry-routes-planner'
    CONTAINER_NAME = 'ferry-routes-planner'
  }

  parameters {
    string(name: 'BRANCH', defaultValue: 'dev', description: 'Git branch to build and deploy')
    string(name: 'APP_PORT', defaultValue: '9090', description: 'Host port (maps to container port 80)')
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: "${params.BRANCH}", url: "${GIT_REPO}"
      }
    }

    stage('Build image') {
      steps {
        script {
          def shortSha = env.GIT_COMMIT?.take(7) ?: 'unknown'
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${shortSha}"
        }
        sh """
          docker build -t ${IMAGE_NAME}:${env.IMAGE_TAG} .
          docker tag ${IMAGE_NAME}:${env.IMAGE_TAG} ${IMAGE_NAME}:latest
        """
      }
    }

    stage('Deploy') {
      steps {
        sh """
          set -e
          docker stop ${CONTAINER_NAME} 2>/dev/null || true
          docker rm ${CONTAINER_NAME} 2>/dev/null || true
          docker run -d \\
            --name ${CONTAINER_NAME} \\
            --restart unless-stopped \\
            -p ${params.APP_PORT}:80 \\
            ${IMAGE_NAME}:${env.IMAGE_TAG}
          docker ps --filter name=${CONTAINER_NAME}
        """
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_NAME}:${env.IMAGE_TAG} → http://<host>:${params.APP_PORT}"
    }
    failure {
      sh "docker logs ${CONTAINER_NAME} 2>/dev/null | tail -50 || true"
    }
  }
}
