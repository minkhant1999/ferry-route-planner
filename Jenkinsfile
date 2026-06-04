pipeline {
  agent any

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    IMAGE_NAME = 'ferry-routes-planner'
    CONTAINER_NAME = 'ferry-routes-planner'
    VITE_OSRM_URL = 'https://router.project-osrm.org'
  }

  parameters {
    string(name: 'BRANCH', defaultValue: 'dev', description: 'Git branch to build and deploy')
    string(name: 'APP_PORT', defaultValue: '9090', description: 'Host port mapped to container port 80')
    string(
      name: 'VITE_OSRM_URL',
      defaultValue: 'https://router.project-osrm.org',
      description: 'OSRM API base URL (baked into the image at build time)'
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
        git branch: "${params.BRANCH}",
            url: "${GIT_REPO}"
      }
    }

    stage('Build image') {
      steps {
        script {
          def shortSha = env.GIT_COMMIT?.take(7) ?: 'unknown'
          env.IMAGE_TAG = "${env.BUILD_NUMBER}-${shortSha}"

          docker.build(
            "${IMAGE_NAME}:${env.IMAGE_TAG}",
            "--build-arg VITE_OSRM_URL=${params.VITE_OSRM_URL} ."
          )

          // Tag latest for convenience on the Jenkins agent
          sh "docker tag ${IMAGE_NAME}:${env.IMAGE_TAG} ${IMAGE_NAME}:latest"
        }
      }
    }

    stage('Deploy container') {
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

          echo "Waiting for container health..."
          for i in \$(seq 1 30); do
            if docker inspect --format='{{.State.Health.Status}}' ${CONTAINER_NAME} 2>/dev/null | grep -q healthy; then
              echo "Container is healthy."
              exit 0
            fi
            if docker inspect --format='{{.State.Status}}' ${CONTAINER_NAME} | grep -q exited; then
              echo "Container exited unexpectedly:"
              docker logs ${CONTAINER_NAME} || true
              exit 1
            fi
            sleep 2
          done

          echo "Container started (health check may still be pending)."
          docker ps --filter name=${CONTAINER_NAME}
        """
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_NAME}:${env.IMAGE_TAG} at http://<jenkins-host>:${params.APP_PORT}"
    }
    failure {
      sh "docker logs ${CONTAINER_NAME} 2>/dev/null | tail -50 || true"
    }
  }
}
