# Quick test script for the sentiment API
Write-Host "Testing Sentiment API..." -ForegroundColor Green

# Test health endpoint
Write-Host "`n1. Testing health endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5001/health" -Method Get
    Write-Host "✓ Health check passed: $($health | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "✗ Health check failed. Is the API running?" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    exit 1
}

# Test predict endpoint
Write-Host "`n2. Testing predict endpoint with positive review..." -ForegroundColor Yellow
try {
    $body = @{
        text = "This hotel was amazing! Great service, clean rooms, and excellent location."
    } | ConvertTo-Json

    $result = Invoke-RestMethod -Uri "http://localhost:5001/predict" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Prediction successful:" -ForegroundColor Green
    Write-Host ($result | ConvertTo-Json -Depth 3) -ForegroundColor Cyan
} catch {
    Write-Host "✗ Prediction test failed" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
}

Write-Host "`n✓ API is working correctly!" -ForegroundColor Green

