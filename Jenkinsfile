pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Jesse-tech141/website.git',
                    branch: 'master',
                    credentialsId: 'github-token'
                )
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                
                // Verify validator exists
                script {
                    if (!fileExists('tools/vnu.jar')) {
                        error "HTML validator (tools/vnu.jar) not found in repository!"
                    }
                    
                    // Validate the jar file
                    def valid = bat(
                        script: 'java -jar tools/vnu.jar --version',
                        returnStatus: true
                    ) == 0
                    
                    if (!valid) {
                        error "The committed validator jar is invalid or corrupted!"
                    }
                }
            }
        }
        
        stage('Lint and Test') {
            steps {
                script {
                    // HTML validation
                    bat 'java -jar tools/vnu.jar --format xml --errors-only --skip-non-html . > html-validation-results.xml || echo "HTML validation completed"'
                    
                    // ESLint
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "ESLint completed"'
                    
                    // Publish reports
                    junit 'html-validation-results.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                bat '''
                    if not exist "dist" mkdir dist
                    xcopy /E /I /Y "*.html" "dist\\"
                    xcopy /E /I /Y "*.css" "dist\\"
                    xcopy /E /I /Y "*.js" "dist\\"
                    xcopy /E /I /Y "images" "dist\\images\\"
                '''
            }
        }
    }
    
    post {
        always {
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                reportDir: '',
                reportFiles: 'eslint-report.html',
                reportName: 'ESLint Report'
            ]
            cleanWs()
        }
        failure {
            echo "Pipeline failed! Build URL: ${env.BUILD_URL}"
        }
    }
}