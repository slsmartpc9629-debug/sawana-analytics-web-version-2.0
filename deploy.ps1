# Sawana Care — Deploy Script
# Always runs from project root regardless of current directory

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Deploying from: $scriptDir" -ForegroundColor Cyan
firebase deploy --only hosting
