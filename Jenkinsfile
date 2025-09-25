pipeline {
    agent any

    tools {
        nodejs 'NodeJS' // The NodeJS installation name you configured in Jenkins
    }

    environment {
        NODE_VERSION = '16' // or whatever Node version you installed
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/<your_repo>.git', 
                    credentialsId: '<your-credentials-id>'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci' // Clean install node_modules
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
                sh 'npx allure open allure-report'
            }
        }
    }

    post {
        always {
            echo "Pipeline finished. You can download or view the Allure report."
        }
    }
}
