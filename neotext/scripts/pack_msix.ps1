<#
.SYNOPSIS
    NeoText Official Microsoft Store MSIX Packager
    Builds the production-ready .msix package for Microsoft Partner Center submission.
    SPDX-License-Identifier: GPL-3.0-or-later
    Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$scriptDir = $PSScriptRoot
$neotextDir = Split-Path -Parent $scriptDir
$rootDir = Split-Path -Parent $neotextDir
$packagingDir = Join-Path $neotextDir "packaging\msix"

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "         NeoText - Microsoft Store MSIX Package Builder           " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

# 1. Locate MakeAppx.exe
Write-Host "[1/4] Locating MakeAppx.exe packaging tool..." -ForegroundColor Yellow
$makeappx = $null

$wingetMakeAppx = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet" -Filter "MakeAppx.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
if ($wingetMakeAppx -and (Test-Path $wingetMakeAppx)) {
    $makeappx = $wingetMakeAppx
}

if (-not $makeappx) {
    $cmd = Get-Command "makeappx.exe" -ErrorAction SilentlyContinue
    if ($cmd) { $makeappx = $cmd.Source }
}

if (-not $makeappx) {
    $kits = Get-ChildItem -Path "C:\Program Files (x86)\Windows Kits", "C:\Program Files\Windows Kits" -Filter "makeappx.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($kits) { $makeappx = $kits }
}

if (-not $makeappx -or -not (Test-Path $makeappx)) {
    Write-Error "MakeAppx.exe could not be found. Please ensure Microsoft.MSIX-Toolkit or Windows SDK is installed."
    exit 1
}
Write-Host "      Found: $makeappx" -ForegroundColor Green

# 2. Verify NeoText Core Binaries
Write-Host "[2/4] Verifying NeoText core binaries..." -ForegroundColor Yellow
$coreExe = Join-Path $neotextDir "NeoText.exe"
if (-not (Test-Path $coreExe)) {
    Write-Host "      NeoText.exe not found. Running build pipeline..." -ForegroundColor Cyan
    & (Join-Path $rootDir "build.ps1")
}
if (-not (Test-Path $coreExe)) {
    Write-Error "NeoText.exe is missing. Run build.bat or build.ps1 first."
    exit 1
}
Write-Host "      NeoText.exe verified." -ForegroundColor Green

# 3. Prepare MSIX Staging
Write-Host "[3/4] Assembling MSIX staging payload..." -ForegroundColor Yellow
$distDir = Join-Path $rootDir "dist"
if (-not (Test-Path $distDir)) {
    New-Item -ItemType Directory -Path $distDir -Force | Out-Null
}

$staging = Join-Path $distDir "msix_staging"
if (Test-Path $staging) {
    Remove-Item $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging | Out-Null
New-Item -ItemType Directory -Path (Join-Path $staging "Assets") | Out-Null

# Copy AppxManifest.xml
Copy-Item (Join-Path $packagingDir "AppxManifest.xml") $staging -Force

# Copy Store Assets
Copy-Item (Join-Path $packagingDir "Assets\*") (Join-Path $staging "Assets") -Force

# Copy Core Binaries and Webview2 Dependencies
$coreFiles = @(
    "NeoText.exe",
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

foreach ($f in $coreFiles) {
    $src = Join-Path $neotextDir $f
    if (Test-Path $src) {
        Copy-Item $src $staging -Force
    }
}

# Copy Assets and Native Runtimes
Copy-Item (Join-Path $neotextDir "assets") $staging -Recurse -Force
Copy-Item (Join-Path $neotextDir "runtimes") $staging -Recurse -Force

# Configure Store Distribution Channel (Swaps Coffee button with localized Rate button)
$storeSettingsPath = Join-Path $staging "app_settings.json"
Set-Content -Path $storeSettingsPath -Value '{"openExternalInTabs": false, "distribution_channel": "store"}' -Encoding UTF8

Write-Host "      Payload staged successfully (Channel: Store)." -ForegroundColor Green

# 4. Compile MSIX Package
Write-Host "[4/4] Packing MSIX package with MakeAppx..." -ForegroundColor Yellow
$msixName = "NeoText_v2.0.8_x64.msix"
$msixPath = Join-Path $distDir $msixName
if (Test-Path $msixPath) {
    Remove-Item $msixPath -Force
}

& $makeappx pack /d "$staging" /p "$msixPath" /nv /o

if ($LASTEXITCODE -ne 0 -or -not (Test-Path $msixPath)) {
    Write-Error "MakeAppx failed to produce MSIX package. Exit code: $LASTEXITCODE"
    exit 1
}

# Clean staging directory
Remove-Item $staging -Recurse -Force

Write-Host "==================================================================" -ForegroundColor Green
Write-Host " [SUCCESS] MICROSOFT STORE MSIX PACKAGE READY!                    " -ForegroundColor Green
Write-Host " Package: $msixName                                               " -ForegroundColor Green
Write-Host " Location: $msixPath                                              " -ForegroundColor Green
Write-Host " Size: $([math]::Round((Get-Item $msixPath).Length / 1MB, 2)) MB  " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Ready for upload to Microsoft Partner Center:                     " -ForegroundColor Cyan
Write-Host "https://partner.microsoft.com/dashboard/products/$($msixName)     " -ForegroundColor Cyan
