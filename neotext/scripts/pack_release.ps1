<#
.SYNOPSIS
    NeoText Official Release Packager
    Bundles compiled binaries, assets, runtimes, and license files into an end-user zip archive.
    SPDX-License-Identifier: GPL-3.0-or-later
    Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot
$neotextDir = Split-Path -Parent $scriptDir
$rootDir = Split-Path -Parent $neotextDir

$distDir = Join-Path $rootDir "dist"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$staging = Join-Path $distDir "NeoText_Portable_Staging"
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging | Out-Null

Write-Host "Staging release files..." -ForegroundColor Cyan

# 1. Executables & Core App Files
$coreFiles = @(
    "NeoText.exe",
    "ConfigureShell.exe",
    "index.html",
    "styles.css",
    "app.js",
    "active_data.js",
    "Introduction.md",
    "app_settings.json",
    "Microsoft.Web.WebView2.Core.dll",
    "Microsoft.Web.WebView2.WinForms.dll",
    "WebView2Loader.dll"
)

foreach ($file in $coreFiles) {
    $src = Join-Path $neotextDir $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination $staging -Force
    }
}

# 2. Assets & Native Runtimes
Copy-Item -Path (Join-Path $neotextDir "assets") -Destination $staging -Recurse -Force
Copy-Item -Path (Join-Path $neotextDir "runtimes") -Destination $staging -Recurse -Force

# 3. Legal and Documentation
Copy-Item -Path (Join-Path $rootDir "LICENSE") -Destination $staging -Force
Copy-Item -Path (Join-Path $rootDir "THIRD_PARTY_LICENSES.md") -Destination $staging -Force
Copy-Item -Path (Join-Path $rootDir "README.md") -Destination $staging -Force

# 4. Create Final Archive
$zipName = "NeoText_v2.0.9_x64_Portable.zip"
$zipPath = Join-Path $distDir $zipName
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Write-Host "Compressing to $zipPath..." -ForegroundColor Cyan
Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Cleanup staging
Remove-Item $staging -Recurse -Force

Write-Host "==================================================================" -ForegroundColor Green
Write-Host " [SUCCESS] RELEASE BUNDLE CREATED: $zipName                       " -ForegroundColor Green
Write-Host " Path: $zipPath                                                   " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Get-Item $zipPath | Select-Object Name, Length, LastWriteTime
