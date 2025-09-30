pipeline {
    agent any
    tools {
        nodejs 'Node 24'
    }

    environment {
        // Non-sensitive
        SIGNUP_TITLE = 'Join Sync Dynamics Today'
        SIGNUP_FIRST_NAME = 'Maaz'
        SIGNUP_LAST_NAME = 'H'
        SIGNUP_PASS = 'StrongPass123!'
        SIGNUP_EMAIL_PREFIX = 'testuse'
        EXISTING_EMAIL = 'giri@admin.com'
        EMAIL_TO = 'sinchanaslnaidu1610@gmail.com'
        DB_USER = 'postgres'

        // Teams IDs
        TEAMS_CHAT_ID = '19:575a63f0-bebb-4bbb-a8aa-72e478c2051d_f168194a-0d61-46ca-be2e-c4e75ff9b8be@unq.gbl.spaces'
        TEAMS_GROUP_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'
        TEAMS_TEAM_ID = '97b3591f-675a-49da-a4af-caec07ef0c5b'
        TEAMS_CHANNEL_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'git@github-work:maaz-hgl/playwright-hris.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'secret_key', variable: 'SECRET_KEY'),
                    string(credentialsId: 'BASE_URL', variable: 'BASE_URL'),
                    string(credentialsId: 'Login_Email_ENCRYPTED', variable: 'Login_Email_ENCRYPTED'),
                    string(credentialsId: 'Login_Password_ENCRYPTED', variable: 'Login_Password_ENCRYPTED'),
                    string(credentialsId: 'DB_DATABASE_NAME_ENCRYPTED', variable: 'DB_DATABASE_NAME_ENCRYPTED'),
                    string(credentialsId: 'DB_PASSWORD_ENCRYPTED', variable: 'DB_PASSWORD_ENCRYPTED'),
                    string(credentialsId: 'EMAIL_USER', variable: 'EMAIL_USER'),
                    string(credentialsId: 'EMAIL_PASS', variable: 'EMAIL_PASS'),
                    string(credentialsId: 'TEAMS_WEBHOOK_URL', variable: 'TEAMS_WEBHOOK_URL'),
                    string(credentialsId: 'GRAPH_ACCESS_TOKEN_ENCRYPTED', variable: 'GRAPH_ACCESS_TOKEN_ENCRYPTED')
                ]) {
                    sh '''
                        echo "Starting Playwright tests..."
                        npx playwright test
                    '''
                }
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
            echo "Build failed, check secrets & environment variables!"
        }
    }
}
