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
            }
        }
        
        stage('Lint and Test') {
            steps {
                script {
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "ESLint completed"'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Create dist directory (if not exists)
                    bat 'if not exist "dist" mkdir dist'
                    
                    // Copy files individually with error handling
                    bat '''
                        @echo off
                        if exist "*.html" (
                            xcopy /Y "*.html" "dist\\" > nul
                        ) else (
                            echo No HTML files found
                        )
                        
                        if exist "*.css" (
                            xcopy /Y "*.css" "dist\\" > nul
                        ) else (
                            echo No CSS files found
                        )
                        
                        if exist "*.js" (
                            xcopy /Y "*.js" "dist\\" > nul
                        ) else (
                            echo No JS files found
                        )
                        
                        if exist "images" (
                            xcopy /E /I /Y "images" "dist\\images\\" > nul
                        ) else (
                            echo No images directory found
                        )
                    '''
                }
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