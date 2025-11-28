# Virtual Mauzin - Quick Setup Script
# This script helps set up the mobile app for development

Write-Host "🚀 Virtual Mauzin Mobile App Setup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Android Studio is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if Android SDK is available
$androidHome = $env:ANDROID_HOME
if ($androidHome) {
    Write-Host "✅ Android SDK found: $androidHome" -ForegroundColor Green
} else {
    Write-Host "⚠️  ANDROID_HOME not set. You'll need to install Android Studio." -ForegroundColor Yellow
    Write-Host "   Download from: https://developer.android.com/studio" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setting up project..." -ForegroundColor Yellow

# Navigate to client directory
Set-Location -Path ".\scratch\client"

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Build the app: npm run mobile:build" -ForegroundColor White
Write-Host "2. Open Android Studio: npm run mobile:open" -ForegroundColor White
Write-Host "3. Run on emulator or device from Android Studio" -ForegroundColor White
Write-Host ""
Write-Host "For Google Play deployment, see: MOBILE_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
