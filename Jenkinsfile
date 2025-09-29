pipeline {
    agent any

    environment {

        NODE_VERSION = '18'

        
        // Non-sensitive
        BASE_URL = 'http://localhost:3000'
        SIGNUP_TITLE = 'Join Sync Dynamics Today'
        SIGNUP_FIRST_NAME = 'Maaz'
        SIGNUP_LAST_NAME = 'H'
        SIGNUP_PASS = 'StrongPass123!'
        SIGNUP_EMAIL_PREFIX = 'testuse'
        EXISTING_EMAIL = 'giri@admin.com'
        EMAIL_TO = 'sinchanaslnaidu1610@gmail.com'

        // Secret key
        SECRET_KEY = '55c1009e51e6c852eea549f1bfa660311262853fef782a9c71555544ef1f69bc'

        // Encrypted sensitive info
        Login_Email_ENCRYPTED = '5d8d0fb0a7348bf4da8f30bc98d400b6:15dca6bda5ba9e610fbeff18bc954ffe'
        Login_Password_ENCRYPTED = '1b27dea003a27cd8fc22fb0820a4e5d3:ea49ca38aceeccbd05fb3abe8f206cb4'
        TEAMS_WEBHOOK_URL = 'e40bca2fabb3a6305a9250d49bd2fae5:de7ccd1f96763ad754659ce8aa518f8abcd8a459201442fabcd9bceef9185b7e0c1160b702e664a93274be2c5ca558f43357d42d8a76b608c9450841ea4572bd53ae07475a2b7577cf690b0d4c5544e5be1b699aa96812ab5e861c28c06a87d3f5e431a50afec3533129b4ea0f58e889b412d2bb9250b5a06e2797bc72f49f2ac6e90b47de395ac199f4ca397cc86f1256f1a10bb1a794fd584ee1ddbbacbe3aac96cab25e4a8ff4a6bce96f4931aff72479ec7e58131017d59abef94f43f9d1ceb59dc84b58d96a0dc5196e0cc11a10ef7ddb700a193a9fb11418548dd40743d60db318c83a1f86a1b03fa85d9d5c96d40aa7e3d8721e192f335d52c899c49e648dc1ea38405bb7e05b3d8b92b414fe'
        EMAIL_USER = '505a634e481b87947ed1a4c1ba43a08b:2ace5af2ae10388eca4b4c8c5a572314cd70655d9936cb0127ce756b250523e3'
        EMAIL_PASS = '2474e96ed2f6cac5fa882d53eb8ebdc8:9ddf970fcd0cceb5acd89b956f6135bf50bf0c95edbbcc6ee9c9bfd0df6410cd'
        GRAPH_ACCESS_TOKEN_ENCRYPTED = 'cf2d2e8026cc24f0ba094a1599bb3610:d9f73c2f37df0f6183a6e0490e84b311d141e8248d361f729e4ee2ff4c9a34e1f8955edd10c83b60ecbb55e9165f287c22e94f8626429357a8a525ff4876ff89c44db8a10f5d293109a0dd9...'

        // Azure
        AZURE_CLIENT_ID = '27158a34-4c57-4be0-8d3e-0a021b06cff2'
        AZURE_TENANT_ID = 'c46e1a6c-b262-4853-ab18-8b103d1702a9'

        // Teams IDs
        TEAMS_CHAT_ID = '19:575a63f0-bebb-4bbb-a8aa-72e478c2051d_f168194a-0d61-46ca-be2e-c4e75ff9b8be@unq.gbl.spaces'
        TEAMS_GROUP_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'
        TEAMS_TEAM_ID = '97b3591f-675a-49da-a4af-caec07ef0c5b'
        TEAMS_CHANNEL_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'

        // Database
        DB_HOST = 'localhost'
        DB_PORT = '5433'
        DB_DATABASE_NAME_ENCRYPTED = '94113b79d892ce95f0151adf8c4d4ef3:618656f56ada430cb3b65c348cd7811f'
        DB_USER = 'postgres'
        DB_PASSWORD_ENCRYPTED = 'f3620cbdd394e921664526aa62900035:57f5f31900a54b9660f930e3581c20ff'
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
                sh '''
                    export $(cat .env | xargs) || true
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
            echo "Build failed, check secrets & environment variables!"
        }
    }
}
