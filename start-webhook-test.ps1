# Script PowerShell untuk Automasi Testing Webhook
# File: start-webhook-test.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WEBHOOK TESTING AUTOMATION SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function untuk cek apakah aplikasi running
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -WarningAction SilentlyContinue
    return $connection.TcpTestSucceeded
}

# 1. Cek Laravel Server
Write-Host "[1/5] Checking Laravel Server..." -ForegroundColor Yellow
if (Test-Port -Port 8000) {
    Write-Host "  ✓ Laravel server is running on port 8000" -ForegroundColor Green
} else {
    Write-Host "  ✗ Laravel server is NOT running" -ForegroundColor Red
    Write-Host "  Starting Laravel server..." -ForegroundColor Yellow
    
    # Start Laravel di background
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; php artisan serve" -WindowStyle Normal
    
    Write-Host "  Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    if (Test-Port -Port 8000) {
        Write-Host "  ✓ Laravel server started successfully" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Failed to start Laravel server" -ForegroundColor Red
        Write-Host "  Please start manually: php artisan serve" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# 2. Cek ngrok
Write-Host "[2/5] Checking ngrok..." -ForegroundColor Yellow
$ngrokInstalled = Get-Command ngrok -ErrorAction SilentlyContinue

if ($null -eq $ngrokInstalled) {
    Write-Host "  ✗ ngrok is NOT installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please install ngrok:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://ngrok.com/download" -ForegroundColor Cyan
    Write-Host "  2. Extract to C:\ngrok" -ForegroundColor Cyan
    Write-Host "  3. Add to PATH or run from that folder" -ForegroundColor Cyan
    exit 1
} else {
    Write-Host "  ✓ ngrok is installed" -ForegroundColor Green
}

Write-Host ""

# 3. Start ngrok
Write-Host "[3/5] Starting ngrok tunnel..." -ForegroundColor Yellow

# Kill existing ngrok process
Get-Process ngrok -ErrorAction SilentlyContinue | Stop-Process -Force

# Start ngrok di background
Start-Process ngrok -ArgumentList "http 8000" -WindowStyle Normal

Write-Host "  Waiting for ngrok to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 4. Get ngrok URL via API
Write-Host ""
Write-Host "[4/5] Retrieving ngrok URL..." -ForegroundColor Yellow

try {
    $ngrokApi = Invoke-RestMethod -Uri "http://localhost:4040/api/tunnels" -Method Get
    $publicUrl = $ngrokApi.tunnels[0].public_url
    
    if ($publicUrl) {
        Write-Host "  ✓ ngrok tunnel created successfully" -ForegroundColor Green
        Write-Host ""
        Write-Host "  ================================================" -ForegroundColor Cyan
        Write-Host "  PUBLIC URL: $publicUrl" -ForegroundColor Green
        Write-Host "  WEBHOOK URL: $publicUrl/webhooks/midtrans" -ForegroundColor Green
        Write-Host "  ================================================" -ForegroundColor Cyan
        Write-Host ""
        
        # Copy to clipboard
        Set-Clipboard -Value "$publicUrl/webhooks/midtrans"
        Write-Host "  ✓ Webhook URL copied to clipboard!" -ForegroundColor Green
        
    } else {
        Write-Host "  ✗ Failed to get ngrok URL" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ✗ Error: $_" -ForegroundColor Red
    Write-Host "  Make sure ngrok is running on port 4040" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 5. Instructions
Write-Host "[5/5] Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  1. Open Midtrans Dashboard:" -ForegroundColor Cyan
Write-Host "     https://dashboard.sandbox.midtrans.com/" -ForegroundColor White
Write-Host ""
Write-Host "  2. Go to: Settings > Configuration" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Paste Webhook URL (already in clipboard):" -ForegroundColor Cyan
Write-Host "     $publicUrl/webhooks/midtrans" -ForegroundColor White
Write-Host ""
Write-Host "  4. Open ngrok Inspector:" -ForegroundColor Cyan
Write-Host "     http://localhost:4040" -ForegroundColor White
Write-Host ""
Write-Host "  5. Monitor Laravel logs:" -ForegroundColor Cyan
Write-Host "     tail -f storage/logs/laravel.log" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Ready for testing! Press CTRL+C to stop" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Open browser tabs
Write-Host "Opening browser tabs..." -ForegroundColor Yellow
Start-Process "http://localhost:4040"
Start-Process "https://dashboard.sandbox.midtrans.com/"

# Keep script running
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host ""
Write-Host "Stopping services..." -ForegroundColor Yellow
Get-Process ngrok -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "Done!" -ForegroundColor Green
