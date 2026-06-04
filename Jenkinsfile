pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    GIT_BRANCH = 'dev'
    APP_PORT = '9090'
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
        sh 'git --version'
        sh 'docker --version'
        sh 'docker compose version'
      }
    }

    stage('Docker Compose Deploy') {
      steps {
        sh 'docker compose down || true'
        sh 'docker compose up -d --build'
      }
    }

    stage('Verify Deployment') {
      steps {
        sh 'sleep 15'
        sh 'docker ps'
        sh """
          if wget -q --spider http://150.95.82.48:${APP_PORT}/ 2>/dev/null || curl -fsS -o /dev/null http://150.95.82.48:${APP_PORT}/; then
            echo 'Application is running successfully on port ${APP_PORT}'
          else
            echo 'Application check failed on port ${APP_PORT}'
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
      echo "App port: ${APP_PORT}"
    }
    failure {
      echo '========================================'
      echo '  DEPLOYMENT FAILED'
      echo '========================================'
      sh 'docker ps -a'
      sh 'docker compose logs --tail=80 app || docker compose logs --tail=80'
    }
  }
}
