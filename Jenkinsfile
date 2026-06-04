pipeline {
  agent any

  triggers {
    pollSCM('* * * * *')
  }

  environment {
    GIT_REPO = 'https://github.com/minkhant1999/ferry-route-planner.git'
    GIT_BRANCH = 'dev'
  }

  stages {
    stage('Git Checkout') {
      steps {
        git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
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
        sh 'sleep 10'
        sh 'docker compose ps'
      }
    }
  }

  post {
    success {
      echo 'DEPLOYMENT SUCCESSFUL — app on port 9090'
    }
    failure {
      sh 'docker compose logs --tail=50'
    }
  }
}
