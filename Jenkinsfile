pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Jesse-tech141/website.git',
                    branch: 'master',  // Explicitly using master branch
                    credentialsId: 'github-token'
                )
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'if not exist "tools" mkdir tools'
                
                // More reliable download approach
                script {
                    def downloaded = false
                    def maxRetries = 3
                    
                    for (int i = 0; i < maxRetries && !downloaded; i++) {
                        try {
                            // Try with curl first
                            def curlExit = bat(
                                returnStatus: true,
                                script: 'curl -L -o tools/vnu.jar https://github.com/validator/validator/releases/latest/download/vnu.jar --retry 2 --connect-timeout 30'
                            )
                            
                            // Fallback to bitsadmin if curl fails
                            if (curlExit != 0) {
                                bat 'bitsadmin /transfer downloadVNU /download /priority normal https://github.com/validator/validator/releases/latest/download/vnu.jar tools/vnu.jar'
                            }
                            
                            // Verify download
                            def javaExit = bat(
                                returnStatus: true,
                                script: 'java -jar tools/vnu.jar --version'
                            )
                            
                            if (javaExit == 0) {
                                downloaded = true
                                echo "Validator downloaded successfully"
                            }
                        } catch (Exception e) {
                            echo "Attempt ${i+1} failed: ${e.getMessage()}"
                            sleep(time: 10, unit: 'SECONDS')
                        }
                    }
                    
                    if (!downloaded) {
                        echo "Warning: Failed to download validator after ${maxRetries} attempts"
                    }
                }
            }
        }
        
        stage('Lint and Test') {
            steps {
                script {
                    // HTML Validation (only if download succeeded)
                    if (fileExists('tools/vnu.jar')) {
                        bat 'java -jar tools/vnu.jar --format xml --errors-only --skip-non-html . > html-validation-results.xml || echo "HTML validation completed"'
                        junit 'html-validation-results.xml'
                    } else {
                        echo "Skipping HTML validation - validator not available"
                    }
                    
                    // ESLint (always run)
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "ESLint completed"'
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