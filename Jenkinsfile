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
                // Install jest-junit if you want test reporting
                bat 'npm install jest-junit --save-dev'
            }
        }
        
        stage('Lint') {
            steps {
                script {
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix'
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Run tests with JUnit reporting
                    bat 'npx jest --ci --reporters=default --reporters=jest-junit --outputFile=test-results.xml'
                }
            }
            post {
                always {
                    junit 'test-results.xml'
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    // Clean dist directory
                    bat 'if exist "dist" rmdir /s /q dist'
                    bat 'mkdir dist'
                    
                    // Copy files with better error handling
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