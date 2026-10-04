Add-Type -AssemblyName System.Drawing

$scriptDir = $PSScriptRoot
$neotextDir = Split-Path -Parent $scriptDir
$rootDir = Split-Path -Parent $neotextDir

$docsImages = Join-Path $rootDir "docs\images"
$guideDir = Join-Path $neotextDir "assets\guide"

if (-not (Test-Path $guideDir)) {
    New-Item -ItemType Directory -Path $guideDir -Force | Out-Null
}

Write-Host "Docs Images path: $docsImages" -ForegroundColor Cyan
Write-Host "Guide Output dir: $guideDir" -ForegroundColor Cyan

# 1. Header controls (Reading width, theme, edit, menu)
$p1 = Join-Path $docsImages "01_workspace_dark.png"
if (Test-Path $p1) {
    $src1 = New-Object System.Drawing.Bitmap($p1)
    $rectHeader = New-Object System.Drawing.Rectangle(580, 0, 786, 60)
    $bmpHeader = $src1.Clone($rectHeader, $src1.PixelFormat)
    $bmpHeader.Save((Join-Path $guideDir "header_controls.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpHeader.Dispose()

    # 2. Left sidebar (Outline, Stats, TOC)
    $rectSidebar = New-Object System.Drawing.Rectangle(0, 0, 290, 520)
    $bmpSidebar = $src1.Clone($rectSidebar, $src1.PixelFormat)
    $bmpSidebar.Save((Join-Path $guideDir "sidebar_navigation.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpSidebar.Dispose()

    # 4. Workspace Dark overview (scaled to width 900)
    $targetWidth = 900
    $targetHeight = [int]($src1.Height * ($targetWidth / $src1.Width))
    $bmpDark = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $gDark = [System.Drawing.Graphics]::FromImage($bmpDark)
    $gDark.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gDark.DrawImage($src1, 0, 0, $targetWidth, $targetHeight)
    $gDark.Dispose()
    $bmpDark.Save((Join-Path $guideDir "workspace_overview.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpDark.Dispose()

    $src1.Dispose()
}

# 3. Options Menu & 20 Languages Dropdown
$p3 = Join-Path $docsImages "03_multilingual_dropdown.png"
if (Test-Path $p3) {
    $src3 = New-Object System.Drawing.Bitmap($p3)
    $rectDropdown = New-Object System.Drawing.Rectangle(1100, 45, 255, 470)
    $bmpDropdown = $src3.Clone($rectDropdown, $src3.PixelFormat)
    $bmpDropdown.Save((Join-Path $guideDir "options_menu.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpDropdown.Dispose()
    $src3.Dispose()
}

# 5. Light Theme preview (scaled to width 900)
$p5 = Join-Path $docsImages "05_light_theme_equations.png"
if (Test-Path $p5) {
    $srcLight = New-Object System.Drawing.Bitmap($p5)
    $targetWidth = 900
    $targetHeight = [int]($srcLight.Height * ($targetWidth / $srcLight.Width))
    $bmpLight = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $gLight = [System.Drawing.Graphics]::FromImage($bmpLight)
    $gLight.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gLight.DrawImage($srcLight, 0, 0, $targetWidth, $targetHeight)
    $gLight.Dispose()
    $bmpLight.Save((Join-Path $guideDir "theme_light.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpLight.Dispose()
    $srcLight.Dispose()
}

# 6. OLED Theme preview (scaled to width 900)
$p4 = Join-Path $docsImages "04_oled_mermaid_diagrams.png"
if (Test-Path $p4) {
    $srcOled = New-Object System.Drawing.Bitmap($p4)
    $targetWidth = 900
    $targetHeight = [int]($srcOled.Height * ($targetWidth / $srcOled.Width))
    $bmpOled = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
    $gOled = [System.Drawing.Graphics]::FromImage($bmpOled)
    $gOled.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gOled.DrawImage($srcOled, 0, 0, $targetWidth, $targetHeight)
    $gOled.Dispose()
    $bmpOled.Save((Join-Path $guideDir "theme_oled.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpOled.Dispose()
    $srcOled.Dispose()
}

# 7. Multi-Tab Strip crop
$pTabs = Join-Path $neotextDir "recovery_points\v205_tab_reordering.png"
if (Test-Path $pTabs) {
    $srcTabs = New-Object System.Drawing.Bitmap($pTabs)
    $rectTabs = New-Object System.Drawing.Rectangle(275, 8, 310, 42)
    $bmpTabs = $srcTabs.Clone($rectTabs, $srcTabs.PixelFormat)
    $bmpTabs.Save((Join-Path $guideDir "tabs_strip.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpTabs.Dispose()
    $srcTabs.Dispose()
}

# 8. Edit Toolbar crop
$pEdit = Join-Path $neotextDir "recovery_points\v182_editor_active_states.png"
if (Test-Path $pEdit) {
    $srcEdit = New-Object System.Drawing.Bitmap($pEdit)
    $rectEdit = New-Object System.Drawing.Rectangle(865, 68, 410, 50)
    $bmpEdit = $srcEdit.Clone($rectEdit, $srcEdit.PixelFormat)
    $bmpEdit.Save((Join-Path $guideDir "edit_toolbar.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpEdit.Dispose()
    $srcEdit.Dispose()
}

Write-Host "Generated guide images successfully:" -ForegroundColor Green
Get-ChildItem $guideDir | Select-Object Name, Length
