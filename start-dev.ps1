# CyberMaze Development Server Startup Script

Write-Host "=== CyberMaze Development Server ===" -ForegroundColor Green
Write-Host ""

# Check if databases are available
Write-Host "Checking database connections..." -ForegroundColor Yellow

# Check MongoDB
$mongoAvailable = $false
try {
    $mongoService = Get-Service -Name "*mongo*" -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Running" }
    if ($mongoService) {
        $mongoAvailable = $true
        Write-Host "✓ MongoDB service is running" -ForegroundColor Green
    } else {
        # Try to check if mongod is available
        $mongoCmd = Get-Command mongod -ErrorAction SilentlyContinue
        if ($mongoCmd) {
            Write-Host "⚠ MongoDB command found but service status unknown" -ForegroundColor Yellow
            Write-Host "  Make sure MongoDB is running" -ForegroundColor Yellow
        } else {
            Write-Host "✗ MongoDB not found" -ForegroundColor Red
            Write-Host "  Install MongoDB or use MongoDB Atlas" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠ Could not check MongoDB status" -ForegroundColor Yellow
}

# Check PostgreSQL
$postgresAvailable = $false
try {
    $postgresService = Get-Service -Name "*postgres*" -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Running" }
    if ($postgresService) {
        $postgresAvailable = $true
        Write-Host "✓ PostgreSQL service is running" -ForegroundColor Green
    } else {
        $postgresCmd = Get-Command psql -ErrorAction SilentlyContinue
        if ($postgresCmd) {
            Write-Host "⚠ PostgreSQL command found but service status unknown" -ForegroundColor Yellow
            Write-Host "  Make sure PostgreSQL is running" -ForegroundColor Yellow
        } else {
            Write-Host "✗ PostgreSQL not found" -ForegroundColor Red
            Write-Host "  Install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠ Could not check PostgreSQL status" -ForegroundColor Yellow
}

Write-Host ""

# Check if .env exists
if (Test-Path "backend\.env") {
    Write-Host "✓ Backend .env file found" -ForegroundColor Green
} else {
    Write-Host "✗ Backend .env file not found" -ForegroundColor Red
    Write-Host "  Creating from template..." -ForegroundColor Yellow
    # Create .env file
    @"
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=cybermaze-super-secret-jwt-key-change-this-in-production-2024
MONGODB_URI=mongodb://localhost:27017/cybermaze
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=cybermaze
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
LOG_LEVEL=info
"@ | Out-File -FilePath "backend\.env" -Encoding utf8
    Write-Host "  ✓ Created backend/.env - Please update with your database credentials" -ForegroundColor Yellow
}

Write-Host ""

# Warn if databases aren't available
if (-not $mongoAvailable -or -not $postgresAvailable) {
    Write-Host "⚠ WARNING: Database services may not be running" -ForegroundColor Yellow
    Write-Host "  The application may fail to start without databases" -ForegroundColor Yellow
    Write-Host "  Run .\setup-databases.ps1 for installation help" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Continue anyway? (Y/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -ne "Y" -and $response -ne "y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit
    }
    Write-Host ""
}

# Start the development servers
Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers
npm run dev

