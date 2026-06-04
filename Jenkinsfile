pipeline {
  agent any

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    IMAGE_NAME = 'ferry-routes-planner'
    CONTAINER_NAME = 'ferry-routes-planner'
    DOCKER_CLI_VERSION = '27.4.1'
  }

  parameters {
    string(name: 'BRANCH', defaultValue: 'dev', description: 'Git branch to build and deploy')
    string(name: 'APP_PORT', defaultValue: '9090', description: 'Host port (maps to container port 80)')
    booleanParam(
      name: 'DOCKER_NO_CACHE',
      defaultValue: false,
      description: 'Force a full Docker rebuild (use after frontend fixes to avoid stale cached dist)'
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

    stage('Setup Docker CLI') {
      steps {
        sh '''
          set -euo pipefail
          BIN_DIR="${WORKSPACE}/.bin"
          mkdir -p "$BIN_DIR"

          if command -v docker >/dev/null 2>&1; then
            echo "Using system docker: $(command -v docker)"
            ln -sf "$(command -v docker)" "$BIN_DIR/docker"
          else
            echo "Docker CLI not found; installing static binary ${DOCKER_CLI_VERSION}..."
            ARCH=$(uname -m)
            case "$ARCH" in
              x86_64|amd64) ARCH=x86_64 ;;
              aarch64|arm64) ARCH=aarch64 ;;
              *)
                echo "Unsupported architecture: $ARCH"
                exit 1
                ;;
            esac
            TMP=$(mktemp -d)
            curl -fsSL \
              "https://download.docker.com/linux/static/stable/${ARCH}/docker-${DOCKER_CLI_VERSION}.tgz" \
              | tar -xzf - -C "$TMP" docker/docker
            mv "$TMP/docker/docker" "$BIN_DIR/docker"
            chmod +x "$BIN_DIR/docker"
            rm -rf "$TMP"
          fi

          "$BIN_DIR/docker" version
          if ! "$BIN_DIR/docker" info >/dev/null 2>&1; then
            echo ""
            echo "ERROR: Docker daemon is not reachable from Jenkins."
            echo "If Jenkins runs in Docker, start it with:"
            echo "  -v /var/run/docker.sock:/var/run/docker.sock"
            echo "Example:"
            echo "  docker run -d --name jenkins -p 8080:8080 -v jenkins_home:/var/jenkins_home \\"
            echo "    -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts"
            exit 1
          fi
        '''
        script {
          env.DOCKER_BIN = "${WORKSPACE}/.bin/docker"
        }
      }
    }

    stage('Build image') {
      steps {
        script {
          def shortSha = env.GIT_COMMIT?.take(7) ?: 'unknown'
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${shortSha}"
          env.DOCKER_BUILD_FLAGS = params.DOCKER_NO_CACHE ? '--no-cache' : ''
        }
        sh """
          set -e
          ${env.DOCKER_BIN} build ${env.DOCKER_BUILD_FLAGS} -t ${IMAGE_NAME}:${env.IMAGE_TAG} .
          ${env.DOCKER_BIN} tag ${IMAGE_NAME}:${env.IMAGE_TAG} ${IMAGE_NAME}:latest
        """
      }
    }

    stage('Deploy') {
      steps {
        sh """
          set -e
          ${env.DOCKER_BIN} stop ${CONTAINER_NAME} 2>/dev/null || true
          ${env.DOCKER_BIN} rm ${CONTAINER_NAME} 2>/dev/null || true
          ${env.DOCKER_BIN} run -d \\
            --name ${CONTAINER_NAME} \\
            --restart unless-stopped \\
            -p ${params.APP_PORT}:80 \\
            ${IMAGE_NAME}:${env.IMAGE_TAG}

          echo "Waiting for container to become healthy..."
          for i in \$(seq 1 30); do
            status=\$(${env.DOCKER_BIN} inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' ${CONTAINER_NAME} 2>/dev/null || echo "missing")
            if [ "\$status" = "healthy" ]; then
              echo "Container is healthy."
              ${env.DOCKER_BIN} ps --filter name=${CONTAINER_NAME}
              exit 0
            fi
            if [ "\$status" = "running" ]; then
              echo "Container is running."
              ${env.DOCKER_BIN} ps --filter name=${CONTAINER_NAME}
              exit 0
            fi
            if [ "\$status" = "exited" ]; then
              echo "Container exited:"
              ${env.DOCKER_BIN} logs ${CONTAINER_NAME} || true
              exit 1
            fi
            sleep 2
          done
          echo "Deploy timed out waiting for container."
          ${env.DOCKER_BIN} logs ${CONTAINER_NAME} || true
          exit 1
        """
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_NAME}:${env.IMAGE_TAG} → http://<host>:${params.APP_PORT}"
      script {
        def docker = env.DOCKER_BIN ?: 'docker'
        sh "${docker} image prune -f || true"
      }
    }
    failure {
      script {
        def docker = env.DOCKER_BIN ?: 'docker'
        sh "${docker} logs ${CONTAINER_NAME} 2>/dev/null | tail -80 || true"
      }
    }
  }
}
