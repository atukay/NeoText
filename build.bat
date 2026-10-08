:: ==============================================================================
:: NeoText Zero-Config Build Script (Windows Native)
:: Compiles NeoText.exe and ConfigureShell.exe using csc.exe.
:: SPDX-License-Identifier: GPL-3.0-or-later
:: ==============================================================================
@echo off
setlocal
cd /d "%~dp0"
echo Starting NeoText Build Pipeline...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0build.ps1"
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Build failed with exit code %ERRORLEVEL%.
    pause
    exit /b %ERRORLEVEL%
)
echo.
echo Build completed successfully.
pause
