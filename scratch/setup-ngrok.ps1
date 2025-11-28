# Virtual Mauzin - ngrok Helper Script
# This script helps you set up ngrok tunnels for your app

Write-Host "🌐 Virtual Mauzin - ngrok Setup Helper" -ForegroundColor Cyan
Write-Host "======================================`n" -ForegroundColor Cyan

# Check if ngrok is installed
$ngrokPath = Get-Command ngrok -ErrorAction SilentlyContinue

if (-not $ngrokPath) {
    Write-Host "❌ ngrok is not installed or not in PATH" -ForegroundColor Red
    Write-Host "`nPlease install ngrok:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://ngrok.com/download" -ForegroundColor White
    Write-Host "2. Extract to a folder (e.g., C:\ngrok)" -ForegroundColor White
    Write-Host "3. Add to PATH or run from that folder`n" -ForegroundColor White
    exit
}

Write-Host "✅ ngrok found at: $($ngrokPath.Source)`n" -ForegroundColor Green

# Check if authenticated
Write-Host "📋 Instructions:" -ForegroundColor Yellow
Write-Host "1. Make sure your services are running:" -ForegroundColor White
Write-Host "   - PeerJS Server: npm start (in scratch/server)" -ForegroundColor Gray
Write-Host "   - Vite Dev Server: npm run dev (in scratch/client)`n" -ForegroundColor Gray

Write-Host "2. You need to run TWO ngrok tunnels in separate terminals:`n" -ForegroundColor White

Write-Host "   Terminal 1 - PeerJS Server (Port 9000):" -ForegroundColor Cyan
Write-Host "   ngrok http 9000`n" -ForegroundColor White

Write-Host "   Terminal 2 - Vite Dev Server (Port 5173):" -ForegroundColor Cyan
Write-Host "   ngrok http 5173 --host-header=`"localhost:5173`"`n" -ForegroundColor White

Write-Host "3. After starting ngrok, copy the URLs and update:" -ForegroundColor White
Write-Host "   - src/config/peerConfig.js (PeerJS URL)" -ForegroundColor Gray
Write-Host "   - vite.config.js (Vite URL)`n" -ForegroundColor Gray

$choice = Read-Host "Would you like to start the PeerJS ngrok tunnel now? (y/n)"

if ($choice -eq 'y' -or $choice -eq 'Y') {
    Write-Host "`n🚀 Starting ngrok for PeerJS Server (Port 9000)..." -ForegroundColor Green
    Write-Host "Copy the Forwarding URL and update src/config/peerConfig.js`n" -ForegroundColor Yellow
    ngrok http 9000
} else {
    Write-Host "`n📖 For detailed instructions, see NGROK_QUICKSTART.md" -ForegroundColor Cyan
}
