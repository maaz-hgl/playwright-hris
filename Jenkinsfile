pipeline {
    agent any

    tools {
        nodejs "NodeJS"  // Make sure this matches your Jenkins NodeJS installation
    }

    // 🔑 Add your environment variables here
    environment {
        SECRET_KEY = '55c1009e51e6c852eea549f1bfa660311262853fef782a9c71555544ef1f69bc' // Replace with your actual value
       
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@github.com:maaz-hgl/playwright-hris.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results -o allure-report --clean'
            }
        }

        stage('Publish Allure Report') {
            steps {
                allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            }
        }
    }

    post {
        always {
            echo "Build finished: ${env.BUILD_URL}"
        }
    }
}
