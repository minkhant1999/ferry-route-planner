pipeline {
  agent any

  environment {
    NODE_VERSION = '22'
  }

  options {
    buildDiscarder(logRotator(numToKeepStr: '20'))
    timestamps()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Setup Node') {
      steps {
        sh '''
          node --version || true
          npm --version
          npm ci
        '''
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run lint'
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Optimize images') {
      steps {
        sh 'npm run optimize:images'
      }
    }

    stage('Docker image') {
      when {
        anyOf {
          branch 'main'
          branch 'master'
        }
      }
      steps {
        script {
          def tag = "${env.BUILD_NUMBER}-${env.GIT_COMMIT?.take(7) ?: 'local'}"
          docker.build(
            "ferry-routes-planner:${tag}",
            "--build-arg VITE_OSRM_URL=${env.VITE_OSRM_URL ?: 'https://router.project-osrm.org'} ."
          )
        }
      }
    }
  }

  post {
    success {
      archiveArtifacts artifacts: 'dist/**', allowEmptyArchive: false, onlyIfSuccessful: true
    }
    always {
      cleanWs()
    }
  }
}
