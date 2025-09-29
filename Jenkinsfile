pipeline {
    agent any

    environment {
        DOTENV_FILE = '.env'
        NODE_VERSION = '18'  // your node version
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'git@github.com:maaz-hgl/playwright-hris.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                // Load env manually before tests
                sh '''
                    export $(cat $DOTENV_FILE | xargs)
                    npx playwright test
                '''
            }
        }

        stage('Generate Allure Report') {
            steps {
                sh 'npx allure generate allure-results --clean -o allure-report'
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
        failure {
            echo "Build failed, check decryption & encrypted values in .env!"
        }
    }
}
