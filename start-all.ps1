$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$processes = @()

function Start-ServiceProcess {
  param(
    [string]$Name,
    [string]$WorkingDirectory,
    [string]$FilePath,
    [string[]]$Arguments
  )

  $proc = Start-Process -FilePath $FilePath -ArgumentList $Arguments -WorkingDirectory $WorkingDirectory -PassThru
  $script:processes += $proc
  Write-Host "$Name started (pid: $($proc.Id))"
}

try {
  $aiDir = Join-Path $root 'AI'
  $aiVenvPython = Join-Path $aiDir '.venv\Scripts\python.exe'

  if (Test-Path $aiVenvPython) {
    Start-ServiceProcess -Name 'AI' -WorkingDirectory $aiDir -FilePath $aiVenvPython -Arguments @('app.py')
  } else {
    Start-ServiceProcess -Name 'AI' -WorkingDirectory $aiDir -FilePath 'python' -Arguments @('app.py')
  }

  Start-ServiceProcess -Name 'Backend' -WorkingDirectory (Join-Path $root 'Backend') -FilePath 'npm' -Arguments @('run', 'start')
  Start-ServiceProcess -Name 'Frontend' -WorkingDirectory (Join-Path $root 'Frontend') -FilePath 'npm' -Arguments @('run', 'dev')

  Start-Process 'http://localhost:3000' | Out-Null
  Write-Host 'All services launched. Press Ctrl+C to stop all.'

  while ($true) {
    Start-Sleep -Seconds 1

    foreach ($proc in $script:processes) {
      if ($proc.HasExited) {
        throw "A service exited unexpectedly (pid: $($proc.Id), code: $($proc.ExitCode))."
      }
    }
  }
}
finally {
  Write-Host ''
  Write-Host 'Stopping all services...'

  foreach ($proc in $script:processes) {
    if (-not $proc.HasExited) {
      try {
        Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
      } catch {
      }
    }
  }
}
