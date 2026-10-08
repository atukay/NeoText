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

# 1. Locate MakeAppx.exe and MakePri.exe
Write-Host "[1/4] Locating packaging tools (MakeAppx & MakePri)..." -ForegroundColor Yellow
$makeappx = $null
$makepri = $null

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

# Locate MakePri in the same directory or search
$candidatePri = Join-Path (Split-Path -Parent $makeappx) "MakePri.exe"
if (Test-Path $candidatePri) {
    $makepri = $candidatePri
} else {
    $wingetMakePri = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet" -Filter "MakePri.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if ($wingetMakePri -and (Test-Path $wingetMakePri)) { $makepri = $wingetMakePri }
}

if (-not $makepri -or -not (Test-Path $makepri)) {
    Write-Error "MakePri.exe could not be found. Please ensure Microsoft.MSIX-Toolkit or Windows SDK is installed."
    exit 1
}

Write-Host "      Found MakeAppx: $makeappx" -ForegroundColor Green
Write-Host "      Found MakePri:  $makepri" -ForegroundColor Green

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
New-Item -ItemType Directory -Path (Join-Path $staging "sessions") | Out-Null

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
Set-Content -Path $storeSettingsPath -Value '{"openExternalInTabs": true, "distribution_channel": "store", "hasShownIntroduction": false}' -Encoding UTF8

# Index resources and build resources.pri
Write-Host "      Indexing package resources with MakePri..." -ForegroundColor Yellow
$priConfig = Join-Path $staging "priconfig.xml"
$priFile = Join-Path $staging "resources.pri"
& $makepri createconfig /cf "$priConfig" /dq en-US /o | Out-Null
& $makepri new /pr "$staging" /cf "$priConfig" /of "$priFile" /o | Out-Null
Remove-Item $priConfig -Force -ErrorAction SilentlyContinue

Write-Host "      Payload and resources.pri staged successfully (Channel: Store)." -ForegroundColor Green

# 4. Compile MSIX Package
Write-Host "[4/4] Packing MSIX package with MakeAppx (strict validation)..." -ForegroundColor Yellow
$msixName = "NeoText_v2.2.0_x64.msix"
$msixPath = Join-Path $distDir $msixName
if (Test-Path $msixPath) {
    Remove-Item $msixPath -Force
}

& $makeappx pack /d "$staging" /p "$msixPath" /o

if ($LASTEXITCODE -ne 0 -or -not (Test-Path $msixPath)) {
    Write-Error "MakeAppx failed to produce MSIX package. Exit code: $LASTEXITCODE"
    exit 1
}

# Clean staging directory
Remove-Item $staging -Recurse -Force

# Automatically sync to root store_releases archive
$storeReleasesDir = Join-Path $rootDir "store_releases"
if (-not (Test-Path $storeReleasesDir)) {
    New-Item -ItemType Directory -Path $storeReleasesDir -Force | Out-Null
}
$storePackagePath = Join-Path $storeReleasesDir $msixName
Copy-Item $msixPath $storePackagePath -Force

Write-Host "==================================================================" -ForegroundColor Green
Write-Host " [SUCCESS] MICROSOFT STORE MSIX PACKAGE READY!                    " -ForegroundColor Green
Write-Host " Package: $msixName                                               " -ForegroundColor Green
Write-Host " Location: $msixPath                                              " -ForegroundColor Green
Write-Host " Archive:  $storePackagePath                                      " -ForegroundColor Green
Write-Host " Size: $([math]::Round((Get-Item $msixPath).Length / 1MB, 2)) MB  " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Ready for upload to Microsoft Partner Center:                     " -ForegroundColor Cyan
Write-Host "https://partner.microsoft.com/dashboard/products/$($msixName)     " -ForegroundColor Cyan
