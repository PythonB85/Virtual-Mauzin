# Virtual Mauzin - Complete Setup and Start Script
# This script helps you set up and run the entire application

param(
    [switch]$UseNgrok,
    [switch]$SetupOnly,
    [string]$NgrokAuthToken
)

$ErrorActionPreference = "Stop"

Write-Host "🎙️ Virtual Mauzin - Setup & Start" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Get project root
$projectRoot = Split-Path -Parent $PSScriptRoot
$clientPath = Join-Path $projectRoot "scratch\client"
$serverPath = Join-Path $projectRoot "scratch\server"
$scratchPath = Join-Path $projectRoot "scratch"

# Function to check if a command exists
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

# Check Node.js
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor White
    exit 1
}
Write-Host "✅ Node.js found: $(node --version)" -ForegroundColor Green

# Check npm
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ npm found: $(npm --version)" -ForegroundColor Green

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow

Write-Host "Installing server dependencies..." -ForegroundColor Gray
Push-Location $serverPath
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location
Write-Host "✅ Server dependencies installed" -ForegroundColor Green

Write-Host "Installing client dependencies..." -ForegroundColor Gray
Push-Location $clientPath
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
Pop-Location
Write-Host "✅ Client dependencies installed" -ForegroundColor Green

if ($SetupOnly) {
    Write-Host "`n✅ Setup complete! You can now run the application." -ForegroundColor Green
    Write-Host "`nTo start locally:" -ForegroundColor Cyan
    Write-Host "  .\start-app.ps1" -ForegroundColor White
    Write-Host "`nTo start with ngrok:" -ForegroundColor Cyan
    Write-Host "  .\start-app.ps1 -UseNgrok" -ForegroundColor White
    exit 0
}
# Check ngrok if needed
if ($UseNgrok) {
    Write-Host "`n🌐 Checking ngrok..." -ForegroundColor Yellow
    
    $ngrokCmd = "ngrok"
    if (-not (Test-Command "ngrok")) {
        # Check current directory and parent directory
        $localNgrokCurrent = Join-Path $PSScriptRoot "ngrok.exe"
        $localNgrokParent = Join-Path $projectRoot "ngrok.exe"
        
        if (Test-Path $localNgrokCurrent) {
            $ngrokCmd = $localNgrokCurrent
            Write-Host "✅ ngrok found in scratch folder: $ngrokCmd" -ForegroundColor Green
        }
        elseif (Test-Path $localNgrokParent) {
            $ngrokCmd = $localNgrokParent
            Write-Host "✅ ngrok found in project root: $ngrokCmd" -ForegroundColor Green
        }
        else {
            Write-Host "❌ ngrok is not installed!" -ForegroundColor Red
            Write-Host "`nPlease install ngrok:" -ForegroundColor Yellow
            Write-Host "1. Download from: https://ngrok.com/download" -ForegroundColor White
            Write-Host "2. Extract to a folder (e.g., C:\ngrok)" -ForegroundColor White
            Write-Host "3. Add to PATH or run from that folder`n" -ForegroundColor White
            exit 1
        }
    }
    else {
        Write-Host "✅ ngrok found in PATH" -ForegroundColor Green
    }

    # Setup ngrok auth token if provided
    if ($NgrokAuthToken) {
        Write-Host "Setting up ngrok auth token..." -ForegroundColor Gray
        & $ngrokCmd config add-authtoken $NgrokAuthToken
        Write-Host "✅ ngrok authenticated" -ForegroundColor Green
    }
}

# Start services
Write-Host "`n🚀 Starting services..." -ForegroundColor Yellow

# Start PeerJS Server
Write-Host "Starting PeerJS Server on port 9000..." -ForegroundColor Gray
$serverJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm start
} -ArgumentList $serverPath

Start-Sleep -Seconds 2
Write-Host "✅ PeerJS Server started" -ForegroundColor Green

# Start Vite Dev Server
Write-Host "Starting Vite Dev Server on port 5173..." -ForegroundColor Gray
$clientJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    npm run dev
} -ArgumentList $clientPath

Start-Sleep -Seconds 3
Write-Host "✅ Vite Dev Server started" -ForegroundColor Green

if ($UseNgrok) {
    Write-Host "`n🌐 Starting ngrok tunnels..." -ForegroundColor Yellow
    
    # Check if ngrok.yml exists
    $ngrokConfig = Join-Path $scratchPath "ngrok.yml"
    if (Test-Path $ngrokConfig) {
        Write-Host "Using ngrok configuration file..." -ForegroundColor Gray
        $ngrokJob = Start-Job -ScriptBlock {
            param($cmd, $configPath)
            & $cmd start --all --config $configPath
        } -ArgumentList $ngrokCmd, $ngrokConfig
        
        Start-Sleep -Seconds 3
        Write-Host "✅ ngrok tunnels started" -ForegroundColor Green
        Write-Host "`n⚠️  IMPORTANT: Check the ngrok output for your URLs!" -ForegroundColor Yellow
        Write-Host "You need to update:" -ForegroundColor White
        Write-Host "  1. vite.config.js - Add Vite ngrok URL to allowedHosts" -ForegroundColor Gray
        Write-Host "  2. src/config/peerConfig.js - Set MODE='ngrok' and update host" -ForegroundColor Gray
    }
    else {
        Write-Host "⚠️  ngrok.yml not found. Starting tunnels manually..." -ForegroundColor Yellow
        Write-Host "`nPlease start ngrok in separate terminals:" -ForegroundColor White
        Write-Host "  Terminal 1: $ngrokCmd http 9000" -ForegroundColor Gray
        Write-Host "  Terminal 2: $ngrokCmd http 5173 --host-header=`"localhost:5173`"" -ForegroundColor Gray
    }
}

Write-Host "`n✅ All services are running!" -ForegroundColor Green
Write-Host "`n📱 Access your app:" -ForegroundColor Cyan
if ($UseNgrok) {
    Write-Host "  Check ngrok output for your public URLs" -ForegroundColor White
}
else {
    Write-Host "  Local: http://localhost:5173" -ForegroundColor White
}

Write-Host "`n📊 Service Status:" -ForegroundColor Cyan
Write-Host "  PeerJS Server: Running (Port 9000)" -ForegroundColor Green
Write-Host "  Vite Dev Server: Running (Port 5173)" -ForegroundColor Green
if ($UseNgrok) {
    Write-Host "  ngrok Tunnels: Running" -ForegroundColor Green
}

Write-Host "`n⚠️  Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host "`n📝 Logs:" -ForegroundColor Cyan

# Monitor jobs
try {
    while ($true) {
        # Check if jobs are still running
        if ($serverJob.State -ne "Running") {
            Write-Host "`n❌ PeerJS Server stopped unexpectedly" -ForegroundColor Red
            Receive-Job $serverJob
            break
        }
        if ($clientJob.State -ne "Running") {
            Write-Host "`n❌ Vite Dev Server stopped unexpectedly" -ForegroundColor Red
            Receive-Job $clientJob
            break
        }
        
        # Show output from jobs
        Receive-Job $serverJob -Keep | ForEach-Object { Write-Host "[Server] $_" -ForegroundColor Blue }
        Receive-Job $clientJob -Keep | ForEach-Object { Write-Host "[Client] $_" -ForegroundColor Magenta }
        
        if ($UseNgrok -and $ngrokJob) {
            if ($ngrokJob.State -ne "Running") {
                Write-Host "`n❌ ngrok stopped unexpectedly" -ForegroundColor Red
                Receive-Job $ngrokJob
                break
            }
            Receive-Job $ngrokJob -Keep | ForEach-Object { Write-Host "[ngrok] $_" -ForegroundColor Cyan }
        }
        
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "`n🛑 Stopping all services..." -ForegroundColor Yellow
    Stop-Job $serverJob -ErrorAction SilentlyContinue
    Stop-Job $clientJob -ErrorAction SilentlyContinue
    if ($UseNgrok -and $ngrokJob) {
        Stop-Job $ngrokJob -ErrorAction SilentlyContinue
    }
    Remove-Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job $clientJob -ErrorAction SilentlyContinue
    if ($UseNgrok -and $ngrokJob) {
        Remove-Job $ngrokJob -ErrorAction SilentlyContinue
    }
    Write-Host "✅ All services stopped" -ForegroundColor Green
}
