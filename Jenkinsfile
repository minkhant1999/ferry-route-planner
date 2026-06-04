pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    GIT_BRANCH = 'dev'
    APP_PORT = '9090'
    DOCKER_CLI_VERSION = '27.4.1'
  }

  stages {
    stage('Git Checkout') {
      steps {
        echo 'Checkout source code'
        git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
      }
    }

    stage('Verify Tools') {
      steps {
        sh '''
          set -euo pipefail
          BIN="${WORKSPACE}/.bin"
          mkdir -p "$BIN"
          export PATH="$BIN:$PATH"

          if command -v docker >/dev/null 2>&1; then
            ln -sf "$(command -v docker)" "$BIN/docker"
          elif [ ! -x "$BIN/docker" ]; then
            echo "Installing Docker CLI ${DOCKER_CLI_VERSION}..."
            ARCH=$(uname -m)
            case "$ARCH" in
              x86_64|amd64) ARCH=x86_64 ;;
              aarch64|arm64) ARCH=aarch64 ;;
              *) echo "Unsupported arch: $ARCH"; exit 1 ;;
            esac
            TMP=$(mktemp -d)
            curl -fsSL "https://download.docker.com/linux/static/stable/${ARCH}/docker-${DOCKER_CLI_VERSION}.tgz" \
              | tar -xzf - -C "$TMP" docker/docker
            mv "$TMP/docker/docker" "$BIN/docker"
            chmod +x "$BIN/docker"
            rm -rf "$TMP"
          fi

          git --version
          docker --version

          if docker compose version >/dev/null 2>&1; then
            docker compose version
          elif command -v docker-compose >/dev/null 2>&1; then
            docker-compose --version
          else
            echo "ERROR: docker compose not found"
            exit 1
          fi

          if ! docker info >/dev/null 2>&1; then
            echo ""
            echo "ERROR: Docker daemon not reachable."
            echo "Start Jenkins with: -v /var/run/docker.sock:/var/run/docker.sock"
            exit 1
          fi
        '''
        script {
          env.DOCKER_PATH = "${WORKSPACE}/.bin"
        }
      }
    }

    stage('Docker Compose Deploy') {
      steps {
        sh '''
          set -e
          export PATH="${DOCKER_PATH}:$PATH"
          docker compose down || true
          docker compose up -d --build
        '''
      }
    }

    stage('Verify Deployment') {
      steps {
        sh """
          set -e
          export PATH="${DOCKER_PATH}:\$PATH"
          sleep 15
          docker ps
          docker compose ps

          running=\$(docker inspect --format='{{.State.Running}}' ferry-routes-planner 2>/dev/null || echo false)
          if [ "\$running" != "true" ]; then
            echo "Container ferry-routes-planner is not running"
            exit 1
          fi

          health=\$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' ferry-routes-planner 2>/dev/null || echo none)
          if [ "\$health" = "healthy" ] || [ "\$health" = "none" ]; then
            echo "Application is running successfully on port ${APP_PORT}"
          else
            echo "Application health check status: \$health"
            exit 1
          fi
        """
      }
    }
  }

  post {
    success {
      echo '========================================'
      echo '  DEPLOYMENT SUCCESSFUL'
      echo '========================================'
      echo "Open in browser: http://150.95.82.48:${APP_PORT}"
    }
    failure {
      echo '========================================'
      echo '  DEPLOYMENT FAILED'
      echo '========================================'
      sh """
        export PATH="${DOCKER_PATH}:\$PATH"
        docker ps -a || true
        docker compose logs --tail=80 app 2>/dev/null || docker compose logs --tail=80 || true
      """
    }
  }
}
