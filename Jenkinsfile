pipeline {
  agent any
  stages {
    stage('checkout') {
      steps {
        git(url: 'https://github.com/btwseeu78/webappazure', branch: 'master', poll: true)
      }
    }

    stage('build') {
      steps {
        sh '''cd Application
npm install
npm run build --if-present'''
      }
    }

  }
}