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
    booleanParam(
      name: 'DOCKER_NO_CACHE',
      defaultValue: false,
      description: 'Force a full Docker rebuild (use after frontend fixes)'
    )
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

    stage('Build & Deploy') {
      steps {
        script {
          def shortSha = env.GIT_COMMIT?.take(7) ?: 'unknown'
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${shortSha}"
        }
        sh """
          set -e
          export IMAGE_TAG=${env.IMAGE_TAG}
          export APP_PORT=${params.APP_PORT}

          if command -v docker >/dev/null 2>&1; then
            DOCKER=\$(command -v docker)
          elif [ -x /usr/bin/docker ]; then
            DOCKER=/usr/bin/docker
          else
            echo "ERROR: docker not found on this Jenkins agent."
            echo "On your VPS, install Docker and allow Jenkins to use it:"
            echo "  sudo apt update && sudo apt install -y docker.io docker-compose-plugin"
            echo "  sudo usermod -aG docker jenkins"
            echo "  sudo systemctl restart jenkins"
            exit 1
          fi

          if \$DOCKER compose version >/dev/null 2>&1; then
            COMPOSE="\$DOCKER compose"
          elif command -v docker-compose >/dev/null 2>&1; then
            COMPOSE="docker-compose"
          else
            echo "ERROR: docker compose not found. Install docker-compose-plugin on the VPS."
            exit 1
          fi

          \$DOCKER info

          \$COMPOSE down || true

          if [ "${params.DOCKER_NO_CACHE}" = "true" ]; then
            \$COMPOSE build --no-cache
          else
            \$COMPOSE build
          fi

          \$COMPOSE up -d --force-recreate
          \$COMPOSE ps

          echo "App URL: http://\$(hostname -I | awk '{print \$1}'):${params.APP_PORT}"
        """
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_NAME}:${env.IMAGE_TAG} on port ${params.APP_PORT}"
      sh 'docker compose image prune -f 2>/dev/null || docker image prune -f || true'
    }
    failure {
      sh '''
        docker compose logs --tail=80 2>/dev/null \
          || docker-compose logs --tail=80 2>/dev/null \
          || docker logs ferry-routes-planner 2>/dev/null | tail -80 \
          || true
      '''
    }
  }
}
