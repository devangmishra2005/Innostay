# PowerShell script to run the sentiment API on Windows
$ErrorActionPreference = "Stop"

Write-Host "Starting Hotel Sentiment API..." -ForegroundColor Green

# Check if venv exists and has the right structure for Windows
if (-not (Test-Path ".\venv\Scripts\python.exe")) {
    Write-Host "Virtual environment not properly set up for Windows." -ForegroundColor Yellow
    Write-Host "Recreating virtual environment..." -ForegroundColor Yellow
    
    # Remove old venv if it exists
    if (Test-Path ".\venv") {
        Remove-Item -Recurse -Force ".\venv"
    }
    
    # Create new venv
    python -m venv venv
    
    # Activate and install dependencies
    & .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
} else {
    # Activate existing venv
    & .\venv\Scripts\Activate.ps1
}

# Run the API
Write-Host "Starting Flask API on port 5001..." -ForegroundColor Green
python api.py

