<#
.SYNOPSIS
    NeoText Zero-Config Build Pipeline
    Compiles NeoText.exe and ConfigureShell.exe using Windows native csc.exe.
    SPDX-License-Identifier: GPL-3.0-or-later
    Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "             NeoText - Zero-Config Build Pipeline                 " -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan

$root = $PSScriptRoot
$neotextDir = Join-Path $root "neotext"

# 1. Locate C# Compiler (csc.exe)
Write-Host "[1/3] Locating Microsoft C# Compiler (csc.exe)..." -ForegroundColor Yellow
$cscPath = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
if (-not (Test-Path $cscPath)) {
    $cscPath = "$env:WINDIR\Microsoft.NET\Framework\v4.0.30319\csc.exe"
}
if (-not (Test-Path $cscPath)) {
    Write-Error "Microsoft .NET Framework 4.x C# compiler (csc.exe) not found on this system."
    exit 1
}
Write-Host "      Found: $cscPath" -ForegroundColor Green

# 2. Check WebView2 Dependencies
Write-Host "[2/3] Checking Microsoft Edge WebView2 SDK dependencies..." -ForegroundColor Yellow
$coreDll = Join-Path $neotextDir "Microsoft.Web.WebView2.Core.dll"
$winformsDll = Join-Path $neotextDir "Microsoft.Web.WebView2.WinForms.dll"
$loaderDll = Join-Path $neotextDir "WebView2Loader.dll"
$nativeLoaderDir = Join-Path $neotextDir "runtimes\win-x64\native"
$nativeLoader = Join-Path $nativeLoaderDir "WebView2Loader.dll"

if (-not (Test-Path $coreDll) -or -not (Test-Path $winformsDll) -or -not (Test-Path $loaderDll)) {
    Write-Host "      WebView2 SDK binaries not found locally. Restoring from NuGet..." -ForegroundColor Cyan
    $pkgVersion = "1.0.2903.40"
    $nugetUrl = "https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/$pkgVersion"
    $tempPkg = Join-Path $env:TEMP "webview2_package.zip"
    $tempExtract = Join-Path $env:TEMP "webview2_extracted"
    
    try {
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        Invoke-WebRequest -Uri $nugetUrl -OutFile $tempPkg -UseBasicParsing
        if (Test-Path $tempExtract) { Remove-Item $tempExtract -Recurse -Force }
        Expand-Archive -Path $tempPkg -DestinationPath $tempExtract -Force
        
        # Locate and copy managed binaries (net462 or net45)
        $managedDir = Join-Path $tempExtract "lib\net462"
        if (-not (Test-Path $managedDir)) { $managedDir = Join-Path $tempExtract "lib\net45" }
        if (-not (Test-Path $managedDir)) {
            $coreFound = Get-ChildItem -Path $tempExtract -Filter "Microsoft.Web.WebView2.Core.dll" -Recurse | Where-Object { $_.FullName -notmatch "lib_manual" } | Select-Object -First 1
            if ($coreFound) { $managedDir = $coreFound.DirectoryName }
        }
        Copy-Item (Join-Path $managedDir "Microsoft.Web.WebView2.Core.dll") $neotextDir -Force
        Copy-Item (Join-Path $managedDir "Microsoft.Web.WebView2.WinForms.dll") $neotextDir -Force
        
        # Locate and copy native x64 loader
        $nativeLoaderSrc = Join-Path $tempExtract "runtimes\win-x64\native\WebView2Loader.dll"
        if (-not (Test-Path $nativeLoaderSrc)) {
            $nativeLoaderSrc = Join-Path $tempExtract "build\native\x64\WebView2Loader.dll"
        }
        if (-not (Test-Path $nativeLoaderDir)) { New-Item -ItemType Directory -Path $nativeLoaderDir -Force | Out-Null }
        Copy-Item $nativeLoaderSrc $nativeLoaderDir -Force
        Copy-Item $nativeLoaderSrc $neotextDir -Force
        
        Write-Host "      WebView2 SDK successfully restored." -ForegroundColor Green
    }
    catch {
        Write-Error "Failed to download WebView2 SDK from NuGet. Error: $_"
        exit 1
    }
    finally {
        if (Test-Path $tempPkg) { Remove-Item $tempPkg -Force -ErrorAction SilentlyContinue }
        if (Test-Path $tempExtract) { Remove-Item $tempExtract -Recurse -Force -ErrorAction SilentlyContinue }
    }
} else {
    Write-Host "      WebView2 SDK dependencies verified." -ForegroundColor Green
}

# 3. Compile NeoText.exe and ConfigureShell.exe
Write-Host "[3/3] Compiling executables..." -ForegroundColor Yellow
$iconPath = Join-Path $neotextDir "assets\neotext_app.ico"
$programCs = Join-Path $neotextDir "Program.cs"
$configureShellCs = Join-Path $neotextDir "ConfigureShell.cs"
$neoTextExe = Join-Path $neotextDir "NeoText.exe"
$configureShellExe = Join-Path $neotextDir "ConfigureShell.exe"

$compileArgsNeoText = @(
    "/nologo",
    "/target:winexe",
    "/platform:x64",
    "/win32icon:$iconPath",
    "/r:$coreDll",
    "/r:$winformsDll",
    "/r:System.Windows.Forms.dll",
    "/r:System.Drawing.dll",
    "/out:$neoTextExe",
    "$programCs"
)

Write-Host "      Compiling NeoText.exe..." -ForegroundColor Cyan
& $cscPath $compileArgsNeoText
if ($LASTEXITCODE -ne 0) {
    Write-Error "NeoText.exe compilation failed."
    exit 1
}

$compileArgsShell = @(
    "/nologo",
    "/target:winexe",
    "/platform:x64",
    "/win32icon:$iconPath",
    "/r:System.Windows.Forms.dll",
    "/r:System.Drawing.dll",
    "/out:$configureShellExe",
    "$configureShellCs"
)

Write-Host "      Compiling ConfigureShell.exe..." -ForegroundColor Cyan
& $cscPath $compileArgsShell
if ($LASTEXITCODE -ne 0) {
    Write-Error "ConfigureShell.exe compilation failed."
    exit 1
}

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host " [SUCCESS] BUILD COMPLETE!                                        " -ForegroundColor Green
Write-Host " Executable: $neoTextExe                                          " -ForegroundColor Green
Write-Host " Shell Config: $configureShellExe                                 " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "To launch NeoText, run: .\neotext\NeoText.exe" -ForegroundColor White
