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
                bat 'if not exist "tools" mkdir tools'
                powershell '''
                    $ProgressPreference = "SilentlyContinue"
                    Invoke-WebRequest -Uri "https://github.com/validator/validator/releases/latest/download/vnu.jar" -OutFile "tools/vnu.jar"
                '''
                bat 'java -jar tools/vnu.jar --version || echo "Validator installation failed"'
                bat 'npm install jest-junit --save-dev'
            }
        }
        
        stage('Lint and Test') {
            steps {
                // HTML validation
                bat 'java -jar tools/vnu.jar --format xml --errors-only --skip-non-html . > html-validation-results.xml || echo "HTML validation completed"'
                
                // ESLint
                bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "ESLint completed"'
                
                // Jest tests
                bat 'npx jest --ci --reporters=default --reporters=jest-junit --outputFile=junit.xml'
                
                // Publish test results
                junit 'junit.xml'
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
        success {
            echo "Pipeline succeeded! Build URL: ${env.BUILD_URL}"
        }
        failure {
            echo "Pipeline failed! Build URL: ${env.BUILD_URL}"
        }
    }
}