pipeline {
    agent any

    tools {
        nodejs "NodeJS"  // Make sure this matches your Jenkins NodeJS installation
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
