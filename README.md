# NeoText

<div align="center">

<img src="neotext/assets/neotext_logo_256.png" alt="NeoText Logo" width="128" height="128" />

### Simple and Lightweight Text Viewer/Editor for Windows

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![Platform: Windows 10 | 11](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011%20(x64)-0078D6.svg)](https://microsoft.com)
[![Architecture: Native Host + WebView2](https://img.shields.io/badge/Architecture-WinForms%20%2B%20WebView2-informational.svg)](#about-the-project)
<br/>
[![Zero CDN: 100% Offline](https://img.shields.io/badge/Offline%20First-100%25%20Zero%20CDN-success.svg)](#key-features)
[![Build: Zero-Config](https://img.shields.io/badge/Build-Zero--Config%20(csc.exe)-brightgreen.svg)](#installation--getting-started)

### Support the Developer

<p align="center">
  <a href="https://apps.microsoft.com/detail/9PG680TWN0LC"><img src="docs/images/badge_store.png" alt="Download from the Microsoft Store" height="48" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://buymeacoffee.com/atukay"><img src="docs/images/badge_coffee.png" alt="Buy Me A Coffee" height="48" /></a>
</p>

[Showcase](#interface-showcase) &nbsp;•&nbsp; [Features](#key-features) &nbsp;•&nbsp; [Installation & Build](#installation--getting-started) &nbsp;•&nbsp; [Shell Integration](#running--shell-integration) &nbsp;•&nbsp; [License](#license--copyright)

</div>

---

## Interface Showcase

<div align="center">

### Modern Dark Workspace & Document Engine
*Native Windows 11 Fluent dark palette, bundled KaTeX LaTeX formula rendering, Prism.js syntax highlighting, and real-time outline navigation.*

<img src="docs/images/01_workspace_dark.png" alt="NeoText Dark Theme Workspace" width="100%" />

<br/><br/>

| Borderless Minimalist Empty State | Multilingual Localization (20 Languages) |
| :---: | :---: |
| <img src="docs/images/02_borderless_empty_state.png" alt="Borderless Empty State" width="100%" /> | <img src="docs/images/03_multilingual_dropdown.png" alt="Multilingual Selector" width="100%" /> |
| *Zero-distraction drag and drop landing screen* | *Theme-aware language dropdown with 20 native translations* |

<br/>

| OLED Pure Black & System Flowcharts | Clean Light Theme & Mathematical Rigor | Polyglot Code Highlighting & Callouts |
| :---: | :---: | :---: |
| <img src="docs/images/04_oled_mermaid_diagrams.png" alt="OLED Theme with Mermaid" width="100%" /> | <img src="docs/images/05_light_theme_equations.png" alt="Light Theme with Math Equations" width="100%" /> | <img src="docs/images/06_syntax_highlighting_callouts.png" alt="Syntax Highlighting and Callouts" width="100%" /> |
| *True #000000 black with local Mermaid.js diagrams* | *Crisp light palette with local KaTeX formula rendering* | *Prism.js syntax highlighting and GitHub-style callouts* |

</div>

---

## About The Project

NeoText is a lightweight, native Windows document viewer and editor designed with an engineering system-modeling discipline to provide an instantaneous, distraction-free environment for technical documentation.

- **Instant Launch & Minimal Footprint:** Initializes the Microsoft Edge WebView2 core in under ~180 ms and operates with a slim ~15-25 MB RAM footprint during typical workflows.
- **Embedded Chromium Power:** Utilizes the Windows native Microsoft Edge WebView2 runtime for crisp typography, modern CSS standards, and hardware-accelerated text rendering.
- **100% Offline First (Zero CDN):** All mathematical fonts, KaTeX typesetting engines, Prism.js syntax highlighters, and Mermaid.js diagramming tools are bundled locally within the application directory. No network connection is ever required.

---

## Key Features

- **Chrome-like Multi-Tab Workspace:** Full tab lifecycle management, horizontal mouse-wheel scrolling, tab overflow navigation with jump menu, smooth drag-and-drop reordering, and instant tab tear-off into floating windows for multi-monitor setups.
- **In-Place Live Editing & Seamless Plain Text:** One-click toggle between rendered reading and live editing (`Ctrl+E`) with floating formatting toolbar, RAW markdown source view, and full-viewport plain text (.txt) editing with responsive caret focus.
- **Interactive GFM Tasklists:** Interactive checklist items (`- [ ]` / `- [x]`) in preview mode can be toggled with a single click, instantly and non-destructively updating the underlying Markdown document on disk.
- **In-Document Find & Replace:** Fast sidebar search (`Ctrl+F`) and Find & Replace (`Ctrl+H`) with single and global replacement ("Replace All"), regex character escaping, real-time match counters, and instant disk persistence.
- **Dedicated Settings Window:** Theme-matched preferences panel (`Ctrl+,`) offering customizable Auto-Save intervals (inactivity ~2.5s, 1m, 5m, 15m), Typewriter Scrolling (keeps typing line centered), Monospace Line Numbers gutter, and External Files opening mode (New Tab vs New Window).
- **Recent Files Hub:** Quick-access stack of your 10 most recently opened documents located directly above the workspace tree, featuring individual removal (`×`) and one-click list clearing.
- **Edge-to-Edge Fullscreen (`F11`):** Pure distraction-free reading and writing experience with seamless Windows DWM border and titlebar restoration on exit (`F11` / `Esc`).
- **3 Native Themes with Titlebar Sync:** Modern Dark (Anthracite `#1c1c1c` matching Windows 11 Fluent design), Clean Light (Daylight Paper), and energy-efficient OLED Pure Black (`#000000`) with dynamic Windows DWM titlebar synchronization.
- **100% Offline LaTeX Mathematics:** Complete `$inline$` and `$$display$$` formula rendering via locally bundled KaTeX engine and local webfonts. Zero network dependencies.
- **Polyglot Syntax Highlighting & Vector Diagrams:** Syntax highlighting across 20+ programming languages via Prism.js with one-click clipboard copying; native SVG flowchart and sequence diagram rendering via Mermaid.js.
- **20-Language Internationalization (i18n):** Native interface translations across 20 languages with automatic Windows display language detection and persistent theme-aware language selector.
- **Smart Drag & Drop & Clipboard Image Pasting:** Drag document files directly into the workspace; paste clipboard screenshots (`Ctrl+V`) in edit mode to automatically save local PNG assets and generate clean markdown syntax.
- **Workspace Tree Explorer & Real-Time Metrics:** Hierarchical directory tree discovery with `FileSystemWatcher` auto-refresh, ScrollSpy Table of Contents (H1–H6), and real-time word/character/reading-time statistics.
- **6-Layer Hardened Security Architecture:** Strict DOM AST sanitization stripping scripts and unsafe elements, bounded 4096-character IPC buffers, protocol whitelisting (`http://`, `https://`, `mailto:`), and a >2 MB large-file guard.
- **Zero-Config Build & Zero-Install Portability:** Built directly with the native Microsoft C# Compiler (`csc.exe`) without heavyweight IDEs; operates cleanly from any folder, USB drive, or network share with zero registry footprint.

---

## Installation & Getting Started

### Option 1: Microsoft Store (Recommended)
NeoText is distributed via the Microsoft Store for verified MSIX sandboxing, automatic background updates, and seamless Windows shell integration:

<p align="center">
  <a href="https://apps.microsoft.com/detail/9PG680TWN0LC">
    <img src="docs/images/badge_store.png" alt="Get it from Microsoft Store" height="48" />
  </a>
</p>

* Direct Store protocol link: [`ms-windows-store://pdp/?productid=9PG680TWN0LC`](ms-windows-store://pdp/?productid=9PG680TWN0LC)

---

### Option 2: Building from Source (Zero-Config)

NeoText is also distributed as a pure, dependency-free open source codebase. Any modern Windows installation with .NET Framework 4.5 or later (pre-installed on Windows 10 and 11) can build the complete project using the native Microsoft C# Compiler (`csc.exe`).

Execute the build script from Command Prompt or PowerShell:

```cmd
build.bat
```

Or via PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\build.ps1
```

**Build Output:**
1. `neotext\NeoText.exe`: Primary application host executable.
2. `neotext\ConfigureShell.exe`: Windows Shell integration and file association utility.

---

## Running & Shell Integration

### Launching NeoText

```powershell
.\neotext\NeoText.exe "neotext\Introduction.md"
```

### Windows Context Menu & File Association

To associate `.md` files and add "Open with NeoText" to the Windows Explorer right-click context menu (no Administrator privileges required, registered to `HKCU`):

```powershell
.\neotext\ConfigureShell.exe
```

---

## License & Copyright

NeoText is free software licensed under the **GNU General Public License v3.0 (GPLv3)**.

```text
Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

See the [LICENSE](LICENSE) file for the full GNU GPL v3 terms.

### Third-Party Software Notices
NeoText bundles components from open-source libraries:
- **Marked.js:** MIT License (Copyright (c) Christopher Jeffrey)
- **KaTeX:** MIT License (Copyright (c) Khan Academy and contributors)
- **Prism.js:** MIT License (Copyright (c) Lea Verou)
- **Mermaid.js:** MIT License (Copyright (c) Knut Sveidqvist)
- **Microsoft Edge WebView2 SDK:** Microsoft Software License (REDIST terms)

Detailed licenses and attribution notices are documented in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
