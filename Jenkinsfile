pipeline {
    agent any

    tools {
        nodejs "NodeJS" // Make sure NodeJS is installed in Jenkins
    }

    environment {
        // # Secret key for decryption
        SECRET_KEY = '55c1009e51e6c852eea549f1bfa660311262853fef782a9c71555544ef1f69bc'

        // # App config
        BASE_URL = 'http://localhost:3000'
        SIGNUP_TITLE = 'Join Sync Dynamics Today'
        SIGNUP_FIRST_NAME = 'Maaz'
        SIGNUP_LAST_NAME = 'H'
        SIGNUP_PASS = 'StrongPass123!'
        SIGNUP_EMAIL_PREFIX = 'testuse'
        EXISTING_EMAIL = 'giri@admin.com'

        // # Email config
        EMAIL_TO = 'sinchanaslnaidu1610@gmail.com'
        EMAIL_USER = '505a634e481b87947ed1a4c1ba43a08b:2ace5af2ae10388eca4b4c8c5a572314cd70655d9936cb0127ce756b250523e3'
        EMAIL_PASS = '2474e96ed2f6cac5fa882d53eb8ebdc8:9ddf970fcd0cceb5acd89b956f6135bf50bf0c95edbbcc6ee9c9bfd0df6410cd'

        // # Teams config
        TEAMS_WEBHOOK_URL = 'e40bca2fabb3a6305a9250d49bd2fae5:de7ccd1f96763ad754659ce8aa518f8abcd9bceef9185b7e0c1160b702e664a93274be2c5ca558f43357d42d8a76b608c9450841ea4572bd53ae07475a2b7577cf690b0d4c5544e5be1b699aa96812ab5e861c28c06a87d3f5e431a50afec3533129b4ea0f58e889b412d2bb9250b5a06e2797bc72f49f2ac6e90b47de395ac199f4ca397cc86f1256f1a10bb1a794fd584ee1ddbbacbe3aac96cab25e4a8ff4a6bce96f4931aff72479ec7e58131017d59abef94f43f9d1ceb59dc84b58d96a0dc5196e0cc11a10ef7ddb700a193a9fb11418548dd40743d60db318c83a1f86a1b03fa85d9d5c96d40aa7e3d8721e192f335d52c899c49e648dc1ea38405bb7e05b3d8b92b414fe'
        TEAMS_CHAT_ID = '19:d561b46e-a37a-4841-a42a-520a90bf1a2b_f168194a-0d61-46ca-be2e-c4e75ff9b8be@unq.gbl.spaces'
        TEAMS_GROUP_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'
        TEAMS_TEAM_ID = '97b3591f-675a-49da-a4af-caec07ef0c5b'
        TEAMS_CHANNEL_ID = '19:DkOoz9LRk_DIHO7QkmC_4Tr_1rF-cPf_OQFK7zF5L_s1@thread.tacv2'
        GRAPH_ACCESS_TOKEN_ENCRYPTED = '51bf660640ec89f45c57c4cfd2f195da:e2e733ba34fef2d0f6e0b3f65c3d73dbb0a1be76fd9aef731e40d62b03eff1784e59c054e55e76c836e583c43aa849a0de0ca21655af1510e512544a989834b794e48b61f377b8264f4598decb3db64d9a28a09097333e88599d1548d7f65e6fb177e7c0b99ada9b8c7d00ffadf7ea3afc7d723bca054035b03949e0793998a7bb06d25fd05465385c9ef22d8705a479662379cbaf7a4460aaf59f385001f14c2498ae781329e778f5f86eea13536527ccbfd5ac0d204775f2779258c9e7595633bff38a00ba3b93670c8229b881378dadc9adaf7daff5bbe195433c217ca41819805fea9930331739b1311da05b582758124896fcab25ef804e98e5a3360c17a51bd1da73d3d391bc3ba7b5cb1abf01e974f09aa0beff51eaaf88107b213d74173ceb5523af5a3992aa477be4e9a8b27ed9738553f021d18857ca4b68cc6a2363317b56c96301d7b5f13354a9262f358a7250d67047eeb361e883500c3bcb25093cf7cad0fd8056fd964e58b08d82d692930691bcc3b7ed8dfeebed244594393aca0bcc4b21e8babd4dc33adca06cd9c70bab515f63b39928b4163aefe2543ebe49ea2616a53b095d656dcb31aa25718309c6ca22e000af084b3930097b4baea0c716145c2926d52eca844bf9e72c5bdd13f184745de28a394aba95e6bdc4cb624efa11765ac2c8f1bcd7b3082db69304343ef514bab955ab89535de1107a48e499aad5e228ef61a65c05bb4e61b009f90d3819a0b18e187cfbf1033e0efe50c4af9e66c9a694998341ec044be4b076e9b37ffc976b4ec6c69f75155b6b259b2b5c5c427a8f0368b3bb9c589d34521d5fcd721fa5eda2169ceb8e59bd7cf5f1776da'
        AZURE_CLIENT_ID = '27158a34-4c57-4be0-8d3e-0a021b06cff2'
        AZURE_TENANT_ID = 'c46e1a6c-b262-4853-ab18-8b103d1702a9'

        // # DB config
        DB_HOST = 'localhost'
        DB_PORT = '5433'
        DB_DATABASE_NAME_ENCRYPTED = '94113b79d892ce95f0151adf8c4d4ef3:618656f56ada430cb3b65c348cd7811f'
        DB_USER = 'postgres'
        DB_PASSWORD_ENCRYPTED = 'f3620cbdd394e921664526aa62900035:57f5f31900a54b9660f930e3581c20ff'
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

        stage('Start HTTP Server for Reports') {
            steps {
                sh '''
                npx http-server reports/my-reports -p 55000 &
                '''
            }
        }

        stage('Send Notifications') {
            steps {
                script {
                    try {
                        sh 'node ./utils/teams.ts'
                    } catch (err) {
                        echo "Failed to send Teams or Email notifications: ${err}"
                    }
                }
            }
        }

        stage('Generate Allure Report') {
            when {
                expression { return currentBuild.result != 'FAILURE' }
            }
            steps {
                sh 'npx allure generate reports/allure-results --clean -o reports/allure-report'
            }
        }

        stage('Publish Allure Report') {
            when {
                expression { return currentBuild.result != 'FAILURE' }
            }
            steps {
                allure([
                    includeProperties: false,
                    jdk: '',
                    results: [[path: 'reports/allure-results']]
                ])
            }
        }
    }

    post {
        always {
            echo "Build finished: ${env.BUILD_URL}"
        }
        failure {
            echo "Build failed. Check test failures and reports."
        }
        success {
            echo "Build succeeded! Reports and notifications sent."
        }
    }
}
