pipeline {
    agent { docker 'eps90/node-yarn' }
    parameters {
        choice(choices: 'dev\nprod', name: 'deploy_env')
    }
    environment {
        ENV_FILE_PATH = credentials("env-${params.deploy_env}")
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }
    stages {
        stage('say hello') {
            steps {
                echo "Building ${params.deploy_env}"
                sh 'yarn --version'
                sh 'gulp --version'
                sh 'node --version'
            }
        }

        stage('install dependencies') {
            steps {
                sh "yarn install"
            }
        }

        stage('set up manifest') {
            when {
                expression {
                    return params.deploy_env == 'dev'
                }
            }
            steps {
                script {
                    def manifest = readJSON file: 'manifest.json'
                    manifest['name'] = "Pull Request Notifier NIGHTLY BUILD"
                    manifest['version'] = manifest.version + "." + env.BUILD_NUMBER
                    writeJSON file: 'manifest.json', json: manifest
                }
            }
        }

        stage('set up environment') {
            steps {
                echo "Running build on ${params.deploy_env} enviornment"
                sh "rm -f .env"
                sh "cp '${ENV_FILE_PATH}' .env"
            }
        }

        stage('build') {
            steps {
                sh "yarn build:prod"
            }
        }

        stage('store') {
            steps {
                archive 'build/*'
            }
        }
    }
}
