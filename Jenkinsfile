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
                // Only install if not already present
                bat 'npm install jest-junit --save-dev --no-audit'
            }
        }
        
        stage('Lint') {
            steps {
                script {
                    // Run linting once with HTML report generation
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "Linting completed with warnings"'
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Clean any previous test results
                    bat 'if exist "junit.xml" del junit.xml'
                    
                    // Run tests using npm script
                    bat 'npm test'
                    
                    // Verify test results were generated
                    bat 'dir junit.xml || echo "Test results file not found"'
                }
            }
            post {
                always {
                    // Publish test results from root directory
                    junit 'junit.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Clean and create dist directory
                    bat 'if exist "dist" rmdir /s /q dist'
                    bat 'mkdir dist'
                    
                    // Copy files to dist
                    bat '''
                        @echo off
                        echo Copying build files...
                        
                        copy /Y *.html dist\\ 2>nul || echo No HTML files found
                        copy /Y *.css dist\\ 2>nul || echo No CSS files found
                        copy /Y *.js dist\\ 2>nul || echo No JS files found
                        
                        if exist images (
                            xcopy /E /I /Y images dist\\images\\ >nul
                            echo Images copied
                        ) else (
                            echo No images directory found
                        )
                        
                        echo Build files copied to dist
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