pipeline {
    agent any
    
    stages {
        // Stage 1: Checkout Code
        stage('Checkout') {
            steps {
                git(
                    url: 'https://github.com/Jesse-tech141/website.git',
                    branch: 'master',
                    credentialsId: 'github-token'
                )
            }
        }
        
        // Stage 2: Install Dependencies
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
                bat 'npm install jest-junit --save-dev'  // Required for JUnit reports
            }
        }
        
        // Stage 3: Linting
        stage('Lint') {
            steps {
                script {
                    bat 'npx eslint script.js -f html -o eslint-report.html --fix || echo "ESLint completed (warnings allowed)"'
                }
            }
        }
        
        // Stage 4: Testing (with JUnit output)
        stage('Test') {
            steps {
                script {
                    // Run tests with JUnit reporter and coverage
                    bat 'npx jest --ci --coverage --reporters=default --reporters=jest-junit --outputFile=test-results.xml'
                }
            }
            post {
                always {
                    // Publish JUnit test results
                    junit 'test-results.xml'
                    
                    // Publish coverage report
                    publishHTML target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Jest Coverage Report'
                    ]
                }
            }
        }
        
        // Stage 5: Build
        stage('Build') {
            steps {
                script {
                    bat '''
                        @echo off
                        if not exist "dist" mkdir dist
                        if exist "*.html" xcopy /Y "*.html" "dist\\" > nul
                        if exist "*.css" xcopy /Y "*.css" "dist\\" > nul
                        if exist "*.js" xcopy /Y "*.js" "dist\\" > nul
                        if exist "images" xcopy /E /I /Y "images" "dist\\images\\" > nul
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Publish ESLint report
            publishHTML target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                reportDir: '',
                reportFiles: 'eslint-report.html',
                reportName: 'ESLint Report'
            ]
            
            // Clean workspace
            cleanWs()
        }
        failure {
            echo "Pipeline failed! Build URL: ${env.BUILD_URL}"
        }
        success {
            echo "Pipeline succeeded. Test results and coverage published."
        }
    }
}