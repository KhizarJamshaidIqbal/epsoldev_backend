# PowerShell Deployment Script for Epsoldev Backend
# This script helps you deploy changes to production

Write-Host "🚀 Epsoldev Backend Deployment Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found!" -ForegroundColor Red
    Write-Host "Please run this script from the server directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Current directory: $currentDir" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Cyan
git status --short

Write-Host ""
Write-Host "Files to be deployed:" -ForegroundColor Yellow
Write-Host "  ✓ middleware/errorHandler.js (NEW)" -ForegroundColor Green
Write-Host "  ✓ server.js (MODIFIED)" -ForegroundColor Yellow
Write-Host "  ✓ middleware/authMiddleware.js (MODIFIED)" -ForegroundColor Yellow
Write-Host "  ✓ controllers/apiTokenController.js (MODIFIED)" -ForegroundColor Yellow
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to proceed with deployment? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📦 Adding files to git..." -ForegroundColor Cyan
git add .

Write-Host ""
Write-Host "💬 Committing changes..." -ForegroundColor Cyan
$commitMessage = "fix: Add error handling middleware and defensive checks for production API"
git commit -m $commitMessage

Write-Host ""
Write-Host "🔄 Pushing to repository..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to repository!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to your Dokploy dashboard" -ForegroundColor White
    Write-Host "  2. Check if auto-deploy is triggered" -ForegroundColor White
    Write-Host "  3. If not, manually click 'Rebuild' button" -ForegroundColor White
    Write-Host "  4. Wait for deployment to complete" -ForegroundColor White
    Write-Host "  5. Check logs for any errors" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Test the API after deployment:" -ForegroundColor Cyan
    Write-Host "  curl https://api.epsoldev.com/api/api-tokens" -ForegroundColor White
    Write-Host ""
    Write-Host "Expected: 401 Unauthorized (instead of 500 error)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to push to repository!" -ForegroundColor Red
    Write-Host "Please check your git configuration and try again" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host ""
