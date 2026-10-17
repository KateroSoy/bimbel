param(
    [int]$ApiPort = 8000,
    [int]$WebPort = 3001
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$backendRoot = Join-Path $projectRoot 'backend'
$envFile = Join-Path $backendRoot '.env'
$runtimeDir = Join-Path $projectRoot '.localdb'

function Test-Port([int]$port) {
    try {
        $client = [System.Net.Sockets.TcpClient]::new()
        $client.Connect('127.0.0.1', $port)
        $client.Close()
        return $true
    } catch { return $false }
}

if (-not (Test-Path -LiteralPath $envFile)) { throw 'backend/.env is missing. Copy backend/.env.example and configure local MySQL first.' }
if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules/vite/bin/vite.js'))) { throw 'Node dependencies are missing. Run npm install first.' }
if (-not (Test-Path -LiteralPath (Join-Path $backendRoot 'vendor/autoload.php'))) { throw 'PHP dependencies are missing. Run composer install in backend first.' }

$values = @{}
Get-Content -LiteralPath $envFile | ForEach-Object {
    if ($_ -match '^([A-Z_]+)=(.*)$') { $values[$matches[1]] = $matches[2].Trim('"') }
}
if ($values.DB_CONNECTION -ne 'mysql') { throw 'Set DB_CONNECTION=mysql in backend/.env to run the local MySQL integration stack.' }
$dbPort = if ($values.DB_PORT) { [int]$values.DB_PORT } else { 3306 }
$dbHost = if ($values.DB_HOST) { $values.DB_HOST } else { '127.0.0.1' }

New-Item -ItemType Directory -Force -Path $runtimeDir | Out-Null
if ($dbHost -eq '127.0.0.1' -and $dbPort -eq 3317 -and -not (Test-Port $dbPort)) {
    $serverExe = Join-Path $runtimeDir 'mariadb/bin/mariadbd.exe'
    $dataDir = Join-Path $runtimeDir 'data'
    if (-not (Test-Path -LiteralPath $serverExe) -or -not (Test-Path -LiteralPath $dataDir)) {
        throw 'The bundled MariaDB is unavailable. Start your local MySQL server or update backend/.env.'
    }
    Start-Process -FilePath $serverExe -ArgumentList ('--datadir="' + $dataDir + '" --port=3317 --bind-address=127.0.0.1 --console') -WorkingDirectory $runtimeDir -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'mariadb-dev.out') -RedirectStandardError (Join-Path $runtimeDir 'mariadb-dev.err') | Out-Null
    for ($attempt = 0; $attempt -lt 20 -and -not (Test-Port $dbPort); $attempt++) { Start-Sleep -Milliseconds 500 }
}
if ($dbHost -eq '127.0.0.1' -and -not (Test-Port $dbPort)) { throw "MySQL is not accepting connections on $dbHost`:$dbPort." }

Push-Location $backendRoot
try {
    php artisan migrate --force
    if ($LASTEXITCODE -ne 0) { throw 'Database migration failed.' }
} finally { Pop-Location }

if (-not (Test-Port $ApiPort)) {
    Start-Process -FilePath (Get-Command php).Source -ArgumentList "artisan serve --host=127.0.0.1 --port=$ApiPort" -WorkingDirectory $backendRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'php-dev.out') -RedirectStandardError (Join-Path $runtimeDir 'php-dev.err') | Out-Null
}
if (-not (Test-Port $WebPort)) {
    Start-Process -FilePath (Get-Command node).Source -ArgumentList "node_modules/vite/bin/vite.js --host=127.0.0.1 --port=$WebPort" -WorkingDirectory $projectRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $runtimeDir 'vite-dev.out') -RedirectStandardError (Join-Path $runtimeDir 'vite-dev.err') | Out-Null
}

Write-Output "Web: http://127.0.0.1:$WebPort"
Write-Output "API: http://127.0.0.1:$ApiPort/api"
Write-Output "Database: $dbHost`:$dbPort / $($values.DB_DATABASE)"
