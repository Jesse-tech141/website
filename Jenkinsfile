pipeline {
    agent any
    
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', 
                url: 'https://github.com/Jesse-tech141/website.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                // Install HTML validator if not already in the project
                bat 'if not exist "tools" mkdir tools'
                bat 'curl -L -o tools/vnu.jar https://github.com/validator/validator/releases/latest/download/vnu.jar'
                // Install jest-junit for test reporting
                bat 'npm install jest-junit --save-dev'
            }
        }
        
        stage('Lint and Test') {
            steps {
                // HTML validation with XML output
                bat 'java -jar tools/vnu.jar --format xml --errors-only --skip-non-html . > html-validation-results.xml || echo "HTML validation completed"'
                
                // ESLint with HTML report
                bat 'npx eslint script.js -f html -o eslint-report.html || echo "ESLint completed"'
                
                // Jest tests with JUnit output
                bat 'npx jest --ci --reporters=default --reporters=jest-junit'
            }
        }
        
        stage('Build') {
            steps {
                // For static website, just copy files to dist
                bat 'if not exist "dist" mkdir dist'
                bat 'xcopy /E /I /Y "*.html" "dist\\"'
                bat 'xcopy /E /I /Y "*.css" "dist\\"'
                bat 'xcopy /E /I /Y "*.js" "dist\\"'
                bat 'xcopy /E /I /Y "images" "dist\\images\\"'
            }
        }
        
        stage('Deploy') {
            steps {
                // Archive the built files
                archiveArtifacts artifacts: 'dist/**/*'
                bat 'echo "Website would be deployed to production here"'
            }
        }
    }
    
    post {
        always {
            // Publish ESLint HTML report
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: '',
                reportFiles: 'eslint-report.html',
                reportName: 'ESLint Report'
            ]
            
            // Publish HTML validation results (XML format)
            junit 'html-validation-results.xml'
            
            // Publish Jest test results
            junit 'junit.xml'
            
            // Clean up workspace
            cleanWs()
        }
        
        success {
            slackSend channel: '#deployments',
                     message: "Website deployed successfully - ${env.BUILD_URL}"
        }
        
        failure {
            slackSend channel: '#build-errors',
                     message: "Build failed - ${env.BUILD_URL}"
        }
    }
}