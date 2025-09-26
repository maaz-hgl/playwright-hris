pipeline {
    agent any

    environment {
        // Load secrets from Jenkins credentials if needed
        SECRET_KEY = credentials('SECRET_KEY_ID') // You can store encrypted keys in Jenkins
        BASE_URL = "http://localhost:3000"
        EMAIL_USER = credentials('EMAIL_USER')
        EMAIL_PASS = credentials('EMAIL_PASS')
    }

    tools {
        nodejs "NodeJS"  // The NodeJS installation you configured in Jenkins
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'git@github-work:maaz-hgl/playwright-hris.git',
                    credentialsId: 'GIT_SSH_CREDENTIALS_ID'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test --reporter=allure-playwright'
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
            archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            junit 'test-results/**/*.xml' // If you have junit reports
        }

        failure {
            mail to: "${EMAIL_USER}",
                 subject: "Playwright Tests Failed",
                 body: "Check Jenkins build ${env.BUILD_URL} for details"
        }
    }
}
