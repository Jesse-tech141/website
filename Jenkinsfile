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
                bat 'npm install'  // Only npm install remains
            }
        }
        
        stage('Lint and Test') {
            steps {
                script {
                    // Only ESLint remains (no HTML validation)
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