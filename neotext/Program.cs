// SPDX-License-Identifier: GPL-3.0-or-later
//
// NeoText - Lightweight, Native Windows Markdown & Document Workspace
// Copyright (C) 2026 The NeoText Project (atukay) <https://github.com/atukay/NeoText>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.IO.Pipes;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

// Assembly Attributes to display clean "NeoText" in Task Manager instead of "NeoText.exe"
[assembly: AssemblyTitle("NeoText")]
[assembly: AssemblyProduct("NeoText")]
[assembly: AssemblyDescription("NeoText - High-Performance Text and Markdown Workspace")]
[assembly: AssemblyCompany("The NeoText Project")]
[assembly: AssemblyCopyright("Copyright © 2026 The NeoText Project (atukay)")]
[assembly: AssemblyFileVersion("2.1.0.0")]
[assembly: AssemblyVersion("2.1.0.0")]

namespace NeoText
{
    static class Program
    {
        [DllImport("shcore.dll")]
        private static extern int SetProcessDpiAwareness(int awareness);

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("shell32.dll", SetLastError = true)]
        private static extern int SetCurrentProcessExplicitAppUserModelID([MarshalAs(UnmanagedType.LPWStr)] string AppID);

        [STAThread]
        static void Main(string[] args)
        {
            try { SetProcessDpiAwareness(2); } catch { try { SetProcessDPIAware(); } catch { } }
            try { SetCurrentProcessExplicitAppUserModelID("NeoText"); } catch { }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string targetFile = null;
            string session = null;
            int startX = -1;
            int startY = -1;
            bool forceNewWindow = false;

            for (int i = 0; i < args.Length; i++)
            {
                if (args[i] == "--new-window")
                {
                    forceNewWindow = true;
                }
                else if (args[i] == "--session" && i + 1 < args.Length)
                {
                    session = args[i + 1];
                    i++;
                }
                else if (args[i] == "--x" && i + 1 < args.Length)
                {
                    int.TryParse(args[i + 1], out startX);
                    i++;
                }
                else if (args[i] == "--y" && i + 1 < args.Length)
                {
                    int.TryParse(args[i + 1], out startY);
                    i++;
                }
                else if (!args[i].StartsWith("--") && string.IsNullOrEmpty(targetFile))
                {
                    targetFile = Path.GetFullPath(args[i]);
                }
            }

            if (string.IsNullOrEmpty(targetFile) && string.IsNullOrEmpty(session))
            {
                string introPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Introduction.md");
                string settingsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app_settings.json");
                bool hasShownIntro = false;

                try
                {
                    if (File.Exists(settingsPath))
                    {
                        string json = File.ReadAllText(settingsPath);
                        if (json.IndexOf("\"hasShownIntroduction\":true", StringComparison.OrdinalIgnoreCase) >= 0 ||
                            json.IndexOf("\"hasShownIntroduction\": true", StringComparison.OrdinalIgnoreCase) >= 0)
                        {
                            hasShownIntro = true;
                        }
                    }
                }
                catch { }

                if (!hasShownIntro && File.Exists(introPath))
                {
                    targetFile = introPath;
                    try
                    {
                        bool openInTabs = true;
                        string channelVal = "store";
                        if (File.Exists(settingsPath))
                        {
                            string json = File.ReadAllText(settingsPath);
                            if (json.IndexOf("\"openExternalInTabs\":false", StringComparison.OrdinalIgnoreCase) >= 0 ||
                                json.IndexOf("\"openExternalInTabs\": false", StringComparison.OrdinalIgnoreCase) >= 0)
                            {
                                openInTabs = false;
                            }
                            if (json.IndexOf("\"distribution_channel\":\"github\"", StringComparison.OrdinalIgnoreCase) >= 0 ||
                                json.IndexOf("\"distribution_channel\": \"github\"", StringComparison.OrdinalIgnoreCase) >= 0)
                            {
                                channelVal = "github";
                            }
                        }
                        string newSettings = string.Format("{{\"openExternalInTabs\": {0}, \"hasShownIntroduction\": true, \"distribution_channel\": \"{1}\"}}", openInTabs ? "true" : "false", channelVal);
                        File.WriteAllText(settingsPath, newSettings, Encoding.UTF8);
                    }
                    catch { }
                }
            }

            // Check external open mode (default: open in tab)
            bool openExternalInTabs = true;
            try
            {
                string userSettingsPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "NeoText_WebView2",
                    "app_settings.json"
                );
                string settingsPath = File.Exists(userSettingsPath) ? userSettingsPath : Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "app_settings.json");
                if (File.Exists(settingsPath))
                {
                    string json = File.ReadAllText(settingsPath);
                    if (json.IndexOf("\"openExternalInTabs\":false", StringComparison.OrdinalIgnoreCase) >= 0 ||
                        json.IndexOf("\"openExternalInTabs\": false", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        openExternalInTabs = false;
                    }
                }
            }
            catch { }

            // If an external file is being opened, not forced new window, and setting is on:
            // Attempt to forward the file to an existing running NeoText instance via Named Pipe
            if (!forceNewWindow && openExternalInTabs && !string.IsNullOrEmpty(targetFile))
            {
                try
                {
                    using (NamedPipeClientStream client = new NamedPipeClientStream(".", "NeoText_SingleInstance_Pipe_2026", PipeDirection.Out))
                    {
                        client.Connect(350); // timeout 350ms
                        using (StreamWriter writer = new StreamWriter(client, Encoding.UTF8))
                        {
                            writer.WriteLine("OPEN_FILE:" + targetFile);
                            writer.Flush();
                        }
                        return; // Successfully handed over to existing instance!
                    }
                }
                catch
                {
                    // No existing instance running or pipe connection timed out; continue and run new MainWindow
                }
            }
            else if (!forceNewWindow && string.IsNullOrEmpty(targetFile) && string.IsNullOrEmpty(session))
            {
                // App opened without files (e.g. clicked in Start Menu or Desktop shortcut).
                // If an instance is already running, activate it and bring to front instead of opening duplicate empty instances!
                try
                {
                    using (NamedPipeClientStream client = new NamedPipeClientStream(".", "NeoText_SingleInstance_Pipe_2026", PipeDirection.Out))
                    {
                        client.Connect(350); // timeout 350ms
                        using (StreamWriter writer = new StreamWriter(client, Encoding.UTF8))
                        {
                            writer.WriteLine("ACTIVATE_WINDOW");
                            writer.Flush();
                        }
                        return; // Successfully activated existing instance!
                    }
                }
                catch
                {
                    // No existing instance running; continue and run new MainWindow
                }
            }

            Application.Run(new MainWindow(targetFile, session, startX, startY));
        }
    }

    public class MainWindow : Form
    {
        [DllImport("dwmapi.dll", PreserveSig = true)]
        private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool BringWindowToTop(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool AllowSetForegroundWindow(int dwProcessId);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, IntPtr ProcessId);

        [DllImport("kernel32.dll")]
        private static extern uint GetCurrentThreadId();

        [DllImport("user32.dll")]
        private static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

        private static readonly IntPtr HWND_TOP = new IntPtr(0);
        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_SHOWWINDOW = 0x0040;
        private const int SW_SHOW = 5;

        public static void ForceForegroundWindow(IntPtr hWnd)
        {
            try
            {
                IntPtr foreWnd = GetForegroundWindow();
                uint foreThread = 0;
                if (foreWnd != IntPtr.Zero)
                {
                    foreThread = GetWindowThreadProcessId(foreWnd, IntPtr.Zero);
                }
                uint currentThread = GetCurrentThreadId();

                if (foreThread != 0 && foreThread != currentThread)
                {
                    AttachThreadInput(currentThread, foreThread, true);
                    BringWindowToTop(hWnd);
                    ShowWindow(hWnd, SW_SHOW);
                    SetWindowPos(hWnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                    SetForegroundWindow(hWnd);
                    AttachThreadInput(currentThread, foreThread, false);
                }
                else
                {
                    BringWindowToTop(hWnd);
                    ShowWindow(hWnd, SW_SHOW);
                    SetWindowPos(hWnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_SHOWWINDOW);
                    SetForegroundWindow(hWnd);
                }
            }
            catch { }
        }

        private const int DWMWA_USE_IMMERSIVE_DARK_MODE = 20;
        private const int DWMWA_USE_IMMERSIVE_DARK_MODE_BEFORE_20H1 = 19;
        private const int DWMWA_BORDER_COLOR = 34;
        private const int DWMWA_CAPTION_COLOR = 35;
        private const int DWMWA_TEXT_COLOR = 36;

        private string targetFile;
        private readonly string appDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
        private readonly string profileDir = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "NeoText_WebView2"
        );

        private string sessionId;
        private string sessionJs;
        private string activeDataJs;
        private WebView2 webView;
        private FileSystemWatcher watcher;
        private FileSystemWatcher workspaceWatcher;
        private string currentWorkspaceDir = null;

        private Thread pipeServerThread;
        private volatile bool isPipeRunning = true;

        private bool hasUnsavedChanges = false;
        private bool isSavingAndExiting = false;
        private bool isDarkMode = true;
        private string currentLang = "en";
        private bool isTearOff = false;
        private bool hasExplicitStartPos = false;
        private int tearStartX = -1;
        private int tearStartY = -1;

        public MainWindow(string file, string session = null, int startX = -1, int startY = -1)
        {
            this.targetFile = file;
            this.sessionId = session;
            this.isTearOff = !string.IsNullOrEmpty(session) && session.StartsWith("tear_");
            this.tearStartX = startX;
            this.tearStartY = startY;
            // Window position and sizing handled in LoadWindowState
            if (startX >= 0 && startY >= 0)
            {
                this.hasExplicitStartPos = true;
                this.StartPosition = FormStartPosition.Manual;
                this.Location = new Point(Math.Max(0, startX - 80), Math.Max(0, startY - 20));
            }
            InitializeWindow();
            InitializeData();
            StartPipeServer();
        }

        private void StartPipeServer()
        {
            try
            {
                pipeServerThread = new Thread(new ThreadStart(PipeServerWorker));
                pipeServerThread.IsBackground = true;
                pipeServerThread.Start();
            }
            catch { }
        }

        private void PipeServerWorker()
        {
            while (isPipeRunning)
            {
                try
                {
                    using (NamedPipeServerStream server = new NamedPipeServerStream("NeoText_SingleInstance_Pipe_2026", PipeDirection.In, NamedPipeServerStream.MaxAllowedServerInstances))
                    {
                        server.WaitForConnection();
                        using (StreamReader reader = new StreamReader(server, Encoding.UTF8))
                        {
                            char[] buf = new char[4096];
                            int read = reader.Read(buf, 0, buf.Length);
                            if (read > 0)
                            {
                                string line = new string(buf, 0, read).Split(new char[] { '\r', '\n' })[0].Trim();
                                if (!string.IsNullOrEmpty(line))
                                {
                                    if (line.StartsWith("OPEN_FILE:"))
                                    {
                                        string filePath = line.Substring("OPEN_FILE:".Length).Trim();
                                        if (filePath.Length > 0 && filePath.Length < 1024 && !filePath.Contains("\0"))
                                        {
                                            this.BeginInvoke(new Action(delegate {
                                                OpenExternalFile(filePath);
                                            }));
                                        }
                                    }
                                    else if (line == "ACTIVATE_WINDOW")
                                    {
                                        this.BeginInvoke(new Action(delegate {
                                            if (this.WindowState == FormWindowState.Minimized)
                                            {
                                                this.WindowState = FormWindowState.Normal;
                                            }
                                            this.Activate();
                                            ForceForegroundWindow(this.Handle);
                                        }));
                                    }
                                }
                            }
                        }
                        try { if (server.IsConnected) server.Disconnect(); } catch { }
                    }
                }
                catch
                {
                    Thread.Sleep(5);
                }
            }
        }

        public void OpenExternalFile(string filePath)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath) || !File.Exists(filePath)) return;

                if (this.WindowState == FormWindowState.Minimized)
                {
                    this.WindowState = FormWindowState.Normal;
                }
                this.Activate();
                SetForegroundWindow(this.Handle);

                ReadAndSendFileContent(filePath);

                string dir = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(dir) && Directory.Exists(dir) && !string.Equals(currentWorkspaceDir, dir, StringComparison.OrdinalIgnoreCase))
                {
                    currentWorkspaceDir = dir;
                    ScanAndSendWorkspaceTree(dir);
                }
            }
            catch { }
        }

        private void InitializeWindow()
        {
            this.Text = "NeoText";
            this.Size = new Size(1140, 800);
            this.MinimumSize = new Size(680, 440);
            if (!hasExplicitStartPos && !isTearOff)
            {
                this.StartPosition = FormStartPosition.CenterScreen;
            }
            else
            {
                this.StartPosition = FormStartPosition.Manual;
            }
            this.BackColor = Color.FromArgb(28, 28, 28); // Anthracite #1c1c1c

            string icoPath = Path.Combine(appDir, @"assets\app.ico");
            if (File.Exists(icoPath))
            {
                try
                {
                    this.Icon = new Icon(icoPath);
                }
                catch { }
            }

            // Restore previous window position, size and maximized state
            LoadWindowState();

            webView = new WebView2
            {
                Dock = DockStyle.Fill,
                DefaultBackgroundColor = Color.FromArgb(28, 28, 28)
            };
            this.Controls.Add(webView);
        }

        private void LoadWindowState()
        {
            try
            {
                int savedX = -1, savedY = -1, savedW = -1, savedH = -1;
                bool isMaximized = false;
                bool hasSavedState = false;

                string stateFile = Path.Combine(profileDir, "window_state.txt");
                if (File.Exists(stateFile))
                {
                    string content = File.ReadAllText(stateFile).Trim();
                    string[] parts = content.Split(',');
                    if (parts.Length >= 5)
                    {
                        int.TryParse(parts[0], out savedX);
                        int.TryParse(parts[1], out savedY);
                        int.TryParse(parts[2], out savedW);
                        int.TryParse(parts[3], out savedH);
                        isMaximized = (parts[4] == "1");
                        hasSavedState = true;
                    }
                }

                if (isTearOff)
                {
                    // In BOTH windowed and fullscreen/maximized modes:
                    // The torn-off window must appear as a separate, floating, normal window directly where user released it.
                    Point spawnOrigin = (hasExplicitStartPos && tearStartX >= 0 && tearStartY >= 0)
                        ? new Point(tearStartX, tearStartY)
                        : Cursor.Position;

                    Screen targetScreen = Screen.FromPoint(spawnOrigin);
                    Rectangle workArea = targetScreen.WorkingArea;

                    int maxFloatW = Math.Max(640, workArea.Width - 100);
                    int maxFloatH = Math.Max(400, workArea.Height - 80);

                    int winW = (hasSavedState && savedW >= 640 && savedW < maxFloatW) ? savedW : Math.Min(1140, maxFloatW);
                    int winH = (hasSavedState && savedH >= 400 && savedH < maxFloatH) ? savedH : Math.Min(800, maxFloatH);

                    int winX = Math.Max(workArea.Left, Math.Min(spawnOrigin.X - 120, workArea.Right - winW));
                    int winY = Math.Max(workArea.Top, Math.Min(spawnOrigin.Y - 25, workArea.Bottom - winH));

                    this.StartPosition = FormStartPosition.Manual;
                    this.Bounds = new Rectangle(winX, winY, winW, winH);
                    this.WindowState = FormWindowState.Normal;
                }
                else if (hasSavedState)
                {
                    Rectangle targetBounds = new Rectangle(savedX, savedY, savedW, savedH);
                    bool isVisibleOnScreen = false;
                    foreach (Screen screen in Screen.AllScreens)
                    {
                        if (screen.WorkingArea.IntersectsWith(targetBounds))
                        {
                            isVisibleOnScreen = true;
                            break;
                        }
                    }

                    if (isVisibleOnScreen && savedW >= 640 && savedH >= 400)
                    {
                        this.StartPosition = FormStartPosition.Manual;
                        this.Bounds = targetBounds;
                    }

                    if (isMaximized)
                    {
                        this.WindowState = FormWindowState.Maximized;
                    }
                }
            }
            catch { }
        }

        private void SaveWindowState()
        {
            try
            {
                Directory.CreateDirectory(profileDir);
                string stateFile = Path.Combine(profileDir, "window_state.txt");

                bool isMaximized = (this.WindowState == FormWindowState.Maximized);
                Rectangle bounds = isMaximized ? this.RestoreBounds : this.Bounds;
                string stateData = string.Format("{0},{1},{2},{3},{4}",
                    bounds.X, bounds.Y, bounds.Width, bounds.Height, isMaximized ? "1" : "0");
                File.WriteAllText(stateFile, stateData);
            }
            catch { }
        }

        protected override void OnFormClosing(FormClosingEventArgs e)
        {
            if (isSavingAndExiting)
            {
                SaveWindowState();
                base.OnFormClosing(e);
                return;
            }

            if (hasUnsavedChanges)
            {
                string prompt;
                string btnYes;
                string btnNo;
                string btnCancel;
                string defaultDoc;

                switch (currentLang)
                {
                    case "tr":
                        prompt = "Belgedeki değişiklikler henüz kaydedilmedi.\n\nÇıkmadan önce kaydetmek istiyor musunuz?";
                        btnYes = "Kaydet";
                        btnNo = "Kaydetme";
                        btnCancel = "İptal";
                        defaultDoc = "Belge";
                        break;
                    case "de":
                        prompt = "Die Änderungen an diesem Dokument wurden noch nicht gespeichert.\n\nMöchten Sie vor dem Schließen speichern?";
                        btnYes = "Speichern";
                        btnNo = "Nicht speichern";
                        btnCancel = "Abbrechen";
                        defaultDoc = "Dokument";
                        break;
                    case "ar":
                        prompt = "لم يتم حفظ التغييرات بعد.\n\nهل تريد حفظ التغييرات قبل الإغلاق؟";
                        btnYes = "حفظ";
                        btnNo = "عدم الحفظ";
                        btnCancel = "إلغاء";
                        defaultDoc = "مستند";
                        break;
                    case "fr":
                        prompt = "Les modifications apportées à ce document n'ont pas été enregistrées.\n\nVoulez-vous enregistrer avant de quitter ?";
                        btnYes = "Enregistrer";
                        btnNo = "Ne pas enregistrer";
                        btnCancel = "Annuler";
                        defaultDoc = "Document";
                        break;
                    case "es":
                        prompt = "Los cambios en este documento no se han guardado.\n\n¿Desea guardar antes de salir?";
                        btnYes = "Guardar";
                        btnNo = "No guardar";
                        btnCancel = "Cancelar";
                        defaultDoc = "Documento";
                        break;
                    case "it":
                        prompt = "Le modifiche a questo documento non sono state salvate.\n\nVuoi salvare prima di uscire?";
                        btnYes = "Salva";
                        btnNo = "Non salvare";
                        btnCancel = "Annulla";
                        defaultDoc = "Documento";
                        break;
                    default: // "en"
                        prompt = "You have unsaved changes in this document.\n\nDo you want to save before exiting?";
                        btnYes = "Save";
                        btnNo = "Don't Save";
                        btnCancel = "Cancel";
                        defaultDoc = "Document";
                        break;
                }

                string docName = !string.IsNullOrEmpty(targetFile) ? Path.GetFileName(targetFile) : defaultDoc;
                var result = DarkMessageBox.Show(
                    this,
                    prompt,
                    "NeoText - " + docName,
                    MessageBoxButtons.YesNoCancel,
                    this.isDarkMode,
                    btnYes, btnNo, btnCancel
                );

                if (result == DialogResult.Cancel)
                {
                    e.Cancel = true;
                    return;
                }
                else if (result == DialogResult.Yes)
                {
                    e.Cancel = true;
                    isSavingAndExiting = true;
                    if (webView != null && webView.CoreWebView2 != null)
                    {
                        webView.CoreWebView2.ExecuteScriptAsync("(window.__NEOTEXT_TRIGGER_SAVE__ || window.__NEOMD_TRIGGER_SAVE__) && (window.__NEOTEXT_TRIGGER_SAVE__ || window.__NEOMD_TRIGGER_SAVE__)();");
                    }
                    return;
                }
                else
                {
                    // DialogResult.No: Discard changes and allow close
                    hasUnsavedChanges = false;
                }
            }

            SaveWindowState();
            base.OnFormClosing(e);
        }

        protected override bool ProcessCmdKey(ref Message msg, Keys keyData)
        {
            if (keyData == (Keys.Alt | Keys.Shift | Keys.T))
            {
                if (webView != null && webView.CoreWebView2 != null)
                {
                    webView.CoreWebView2.ExecuteScriptAsync("document.getElementById('theme-toggle-btn') && document.getElementById('theme-toggle-btn').click();");
                    return true;
                }
            }
            return base.ProcessCmdKey(ref msg, keyData);
        }

        protected override void OnHandleCreated(EventArgs e)
        {
            base.OnHandleCreated(e);
            SetDwmTheme(true);
        }

        protected override void OnShown(EventArgs e)
        {
            base.OnShown(e);
            try
            {
                if (this.WindowState == FormWindowState.Minimized)
                {
                    this.WindowState = FormWindowState.Normal;
                }

                if (isTearOff)
                {
                    ForceForegroundWindow(this.Handle);
                }
                this.Activate();
                this.BringToFront();
            }
            catch { }
            InitializeWebView();
        }

        private string currentTheme = "dark";

        public void SetDwmTheme(string theme)
        {
            this.currentTheme = theme;
            this.isDarkMode = (theme != "light");
            if (!this.IsHandleCreated || this.IsDisposed) return;

            try
            {
                Color appBg = (theme == "oled") ? Color.FromArgb(0, 0, 0) : ((theme == "dark") ? Color.FromArgb(28, 28, 28) : Color.FromArgb(255, 255, 255));
                this.BackColor = appBg;
                if (webView != null)
                {
                    webView.DefaultBackgroundColor = appBg;
                }

                int darkFlag = (theme == "light") ? 0 : 1;
                DwmSetWindowAttribute(this.Handle, DWMWA_USE_IMMERSIVE_DARK_MODE, ref darkFlag, sizeof(int));
                DwmSetWindowAttribute(this.Handle, DWMWA_USE_IMMERSIVE_DARK_MODE_BEFORE_20H1, ref darkFlag, sizeof(int));

                // Windows 11 DWM Color format is 0x00BBGGRR (BGR)
                // OLED: Pure pitch black #000000 -> 0x00000000
                // Dark: Anthracite matching user swatch #1C1C1C -> 0x001C1C1C
                // Light: Seamless matching white header #FFFFFF -> 0x00FFFFFF
                int captionColor = (theme == "oled") ? 0x00000000 : ((theme == "dark") ? 0x001C1C1C : 0x00FFFFFF);
                int borderColor  = (theme == "oled") ? 0x00262626 : ((theme == "dark") ? 0x001C1C1C : 0x00D0D7DE);
                int textColor    = (theme == "light") ? 0x001F2328 : 0x00FFFFFF;

                DwmSetWindowAttribute(this.Handle, DWMWA_CAPTION_COLOR, ref captionColor, sizeof(int));
                DwmSetWindowAttribute(this.Handle, DWMWA_BORDER_COLOR, ref borderColor, sizeof(int));
                DwmSetWindowAttribute(this.Handle, DWMWA_TEXT_COLOR, ref textColor, sizeof(int));
            }
            catch { }
        }

        public void SetDwmTheme(bool isDark)
        {
            SetDwmTheme(isDark ? "dark" : "light");
        }

        private void InitializeData()
        {
            try
            {
                string sessionsDir = Path.Combine(profileDir, "sessions");
                try
                {
                    if (!Directory.Exists(sessionsDir))
                    {
                        Directory.CreateDirectory(sessionsDir);
                    }
                }
                catch { }

                if (string.IsNullOrEmpty(sessionId))
                {
                    sessionId = Guid.NewGuid().ToString("N").Substring(0, 8);
                }
                sessionJs = Path.Combine(sessionsDir, sessionId + ".js");
                activeDataJs = Path.Combine(profileDir, "active_data.js");

                if (!string.IsNullOrEmpty(targetFile) && File.Exists(targetFile))
                {
                    UpdateDataFiles(false);
                    SetupWatcher();
                }
                else if (!string.IsNullOrEmpty(sessionId) && File.Exists(sessionJs))
                {
                    try
                    {
                        string sText = File.ReadAllText(sessionJs);
                        string fPath = ExtractJsonField(sText, "filePath");
                        if (!string.IsNullOrEmpty(fPath) && File.Exists(fPath))
                        {
                            this.targetFile = fPath;
                            SetupWatcher();
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }

        private async void InitializeWebView()
        {
            try
            {
                var env = await CoreWebView2Environment.CreateAsync(null, profileDir);
                await webView.EnsureCoreWebView2Async(env);

                string distChannel = "github";
                try
                {
                    string userSettings = Path.Combine(profileDir, "app_settings.json");
                    string settingsPath = File.Exists(userSettings) ? userSettings : Path.Combine(appDir, "app_settings.json");
                    if (File.Exists(settingsPath))
                    {
                        string rawCfg = File.ReadAllText(settingsPath);
                        if (rawCfg.IndexOf("\"distribution_channel\":\"store\"", StringComparison.OrdinalIgnoreCase) >= 0 ||
                            rawCfg.IndexOf("\"distribution_channel\": \"store\"", StringComparison.OrdinalIgnoreCase) >= 0)
                        {
                            distChannel = "store";
                        }
                    }
                    if (appDir.IndexOf("WindowsApps", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        distChannel = "store";
                    }
                }
                catch { }

                await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync("window.__NEOTEXT_CHANNEL__ = '" + distChannel + "';");

                // In-memory document data injection:
                // If targetFile or session data exists, inject window.__NEOTEXT_DATA__ directly into DOM before scripts run.
                // 100% offline, zero disk permissions latency, works seamlessly in Microsoft Store (WindowsApps) and Portable modes.
                if (!string.IsNullOrEmpty(targetFile) && File.Exists(targetFile))
                {
                    try
                    {
                        string content = "";
                        using (FileStream fs = new FileStream(targetFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                        using (StreamReader sr = new StreamReader(fs, Encoding.UTF8))
                        {
                            content = sr.ReadToEnd();
                        }
                        FileInfo fi = new FileInfo(targetFile);
                        string escapedContent = EscapeJson(content);
                        string escapedPath = targetFile.Replace("\\", "\\\\");
                        string escapedName = EscapeJson(fi.Name);
                        string initScript = string.Format(
                            "window.__NEOTEXT_DATA__ = window.__NEOMD_DATA__ = {{ filePath: \"{0}\", fileName: \"{1}\", content: \"{2}\", rawMarkdown: \"{2}\", lastModified: {3}, isDirty: false }};",
                            escapedPath, escapedName, escapedContent, fi.LastWriteTimeUtc.Ticks
                        );
                        await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(initScript);
                    }
                    catch { }
                }
                else if (!string.IsNullOrEmpty(sessionId) && File.Exists(sessionJs))
                {
                    try
                    {
                        string sText = File.ReadAllText(sessionJs);
                        if (!string.IsNullOrEmpty(sText))
                        {
                            await webView.CoreWebView2.AddScriptToExecuteOnDocumentCreatedAsync(sText);
                        }
                    }
                    catch { }
                }

                webView.CoreWebView2.Settings.IsStatusBarEnabled = false;
                webView.CoreWebView2.Settings.AreDevToolsEnabled = false;
                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
                webView.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled = false;

                // Sync Window Title directly from Document
                webView.CoreWebView2.DocumentTitleChanged += (s, e) =>
                {
                    string title = webView.CoreWebView2.DocumentTitle;
                    if (!string.IsNullOrWhiteSpace(title))
                    {
                        this.BeginInvoke(new Action(() => this.Text = title));
                    }
                };

                // Open external links (e.g. GitHub) in user's default system browser
                webView.CoreWebView2.NewWindowRequested += (s, e) =>
                {
                    e.Handled = true;
                    if (!string.IsNullOrEmpty(e.Uri) && (e.Uri.StartsWith("http://") || e.Uri.StartsWith("https://")))
                    {
                        try
                        {
                            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(e.Uri) { UseShellExecute = true });
                        }
                        catch { }
                    }
                };

                // Sync Theme dynamically from app.js postMessage with smooth transition delay, or open external URLs
                webView.CoreWebView2.WebMessageReceived += async (s, e) =>
                {
                    try
                    {
                        string msg = e.TryGetWebMessageAsString();
                        if (msg.StartsWith("lang:"))
                        {
                            currentLang = msg.Substring("lang:".Length).Trim().ToLowerInvariant();
                            return;
                        }

                        if (msg == "dirty:true")
                        {
                            hasUnsavedChanges = true;
                            return;
                        }

                        if (msg == "dirty:false")
                        {
                            hasUnsavedChanges = false;
                            return;
                        }

                        if (msg.StartsWith("save_content:"))
                        {
                            string content = msg.Substring("save_content:".Length);
                            SaveContentToFile(content);
                            return;
                        }

                        if (msg.StartsWith("save_tab_file:"))
                        {
                            string payload = msg.Substring("save_tab_file:".Length);
                            int pipeIdx = payload.IndexOf('|');
                            if (pipeIdx > 0)
                            {
                                string filePath = payload.Substring(0, pipeIdx);
                                string content = payload.Substring(pipeIdx + 1);
                                SaveTabFile(filePath, content);
                            }
                            return;
                        }

                        if (msg == "open_file_dialog")
                        {
                            this.BeginInvoke(new Action(() => OpenFileDialogPrompt()));
                            return;
                        }

                        if (msg == "open_workspace_folder")
                        {
                            this.BeginInvoke(new Action(() => OpenWorkspaceFolderDialog()));
                            return;
                        }

                        if (msg.StartsWith("scan_workspace_folder:"))
                        {
                            string folderPath = msg.Substring("scan_workspace_folder:".Length);
                            this.BeginInvoke(new Action(() => ScanAndSendWorkspaceTree(folderPath)));
                            return;
                        }

                        if (msg.StartsWith("read_file_content:"))
                        {
                            string filePath = msg.Substring("read_file_content:".Length);
                            this.BeginInvoke(new Action(() => ReadAndSendFileContent(filePath)));
                            return;
                        }

                        if (msg.StartsWith("tear_off_tab:"))
                        {
                            string payload = msg.Substring("tear_off_tab:".Length);
                            this.BeginInvoke(new Action(delegate { TearOffTab(payload); }));
                            return;
                        }

                        if (msg.StartsWith("set_external_open_mode:"))
                        {
                            string mode = msg.Substring("set_external_open_mode:".Length).Trim();
                            SaveExternalOpenMode(mode == "tab");
                            return;
                        }

                        if (msg.StartsWith("save_clipboard_image:"))
                        {
                            string payload = msg.Substring("save_clipboard_image:".Length);
                            SaveClipboardImage(payload);
                            return;
                        }

                        if (msg.StartsWith("prompt_ctrl_s"))
                        {
                            string promptText = "Kayıt etmek istiyor musunuz?";
                            string btn1 = "Evet";
                            string btn2 = "Hayır";
                            string docName = !string.IsNullOrEmpty(targetFile) ? Path.GetFileName(targetFile) : "NeoText";

                            if (msg.StartsWith("prompt_ctrl_s:"))
                            {
                                string payload = msg.Substring("prompt_ctrl_s:".Length);
                                string[] parts = payload.Split('|');
                                if (parts.Length > 0 && !string.IsNullOrEmpty(parts[0])) promptText = parts[0];
                                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) btn1 = parts[1];
                                if (parts.Length > 2 && !string.IsNullOrEmpty(parts[2])) btn2 = parts[2];
                                if (parts.Length > 3 && !string.IsNullOrEmpty(parts[3])) docName = parts[3];
                            }

                            this.BeginInvoke(new Action(() =>
                            {
                                var res = DarkMessageBox.Show(this, promptText, "NeoText - " + docName, MessageBoxButtons.YesNo, this.isDarkMode, btn1, btn2);
                                if (res == DialogResult.Yes)
                                {
                                    if (webView != null && webView.CoreWebView2 != null)
                                    {
                                        webView.CoreWebView2.ExecuteScriptAsync("(window.__NEOTEXT_TRIGGER_SAVE__ || window.__NEOMD_TRIGGER_SAVE__) && (window.__NEOTEXT_TRIGGER_SAVE__ || window.__NEOMD_TRIGGER_SAVE__)();");
                                    }
                                }
                            }));
                            return;
                        }

                        if (msg.StartsWith("save_as:"))
                        {
                            string payload = msg.Substring("save_as:".Length);
                            string suggestedName = "";
                            string content = payload;
                            int pipeIdx = payload.IndexOf('|');
                            if (pipeIdx >= 0)
                            {
                                suggestedName = payload.Substring(0, pipeIdx);
                                content = payload.Substring(pipeIdx + 1);
                            }
                            this.BeginInvoke(new Action(() => HandleSaveAs(content, suggestedName)));
                            return;
                        }

                        if (msg.StartsWith("convert_prompt:md_to_txt"))
                        {
                            string warnMsg = "Biçimlendirme kaybı olabilir. Belgeyi nasıl kaydetmek istersiniz?";
                            string optRendered = "Biçimlendirilmiş Metin";
                            string optRaw = "Ham Kod";
                            string optCancel = "İptal";

                            if (msg.StartsWith("convert_prompt:md_to_txt|"))
                            {
                                string payload = msg.Substring("convert_prompt:md_to_txt|".Length);
                                string[] parts = payload.Split('|');
                                if (parts.Length > 0 && !string.IsNullOrEmpty(parts[0])) warnMsg = parts[0];
                                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) optRendered = parts[1];
                                if (parts.Length > 2 && !string.IsNullOrEmpty(parts[2])) optRaw = parts[2];
                                if (parts.Length > 3 && !string.IsNullOrEmpty(parts[3])) optCancel = parts[3];
                            }

                            this.BeginInvoke(new Action(() =>
                            {
                                string docName = !string.IsNullOrEmpty(targetFile) ? Path.GetFileName(targetFile) : "NeoText";
                                var res = DarkMessageBox.Show(this, warnMsg, "NeoText - " + docName, MessageBoxButtons.YesNoCancel, this.isDarkMode, optRendered, optRaw, optCancel);
                                if (res == DialogResult.Yes)
                                {
                                    if (webView != null && webView.CoreWebView2 != null)
                                    {
                                        webView.CoreWebView2.ExecuteScriptAsync("(window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__) && (window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__)('rendered');");
                                    }
                                }
                                else if (res == DialogResult.No)
                                {
                                    if (webView != null && webView.CoreWebView2 != null)
                                    {
                                        webView.CoreWebView2.ExecuteScriptAsync("(window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__) && (window.__NEOTEXT_ON_CONVERT_CHOICE__ || window.__NEOMD_ON_CONVERT_CHOICE__)('raw');");
                                    }
                                }
                            }));
                            return;
                        }

                        if (msg.StartsWith("save_converted_txt:"))
                        {
                            string payload = msg.Substring("save_converted_txt:".Length);
                            int pipeIdx = payload.IndexOf('|');
                            string suggestedName = (pipeIdx >= 0) ? payload.Substring(0, pipeIdx) : "Document.txt";
                            string content = (pipeIdx >= 0) ? payload.Substring(pipeIdx + 1) : payload;
                            this.BeginInvoke(new Action(() => HandleSaveConvertedFile(suggestedName, content, ".txt")));
                            return;
                        }

                        if (msg.StartsWith("convert_txt_to_md:"))
                        {
                            string payload = msg.Substring("convert_txt_to_md:".Length);
                            int pipeIdx = payload.IndexOf('|');
                            string suggestedName = (pipeIdx >= 0) ? payload.Substring(0, pipeIdx) : "Document.md";
                            string content = (pipeIdx >= 0) ? payload.Substring(pipeIdx + 1) : payload;
                            this.BeginInvoke(new Action(() => HandleSaveConvertedFile(suggestedName, content, ".md")));
                            return;
                        }

                        if (msg.StartsWith("open_url:"))
                        {
                            string url = msg.Substring("open_url:".Length).Trim();
                            try
                            {
                                if (IsValidSafeWebUrl(url))
                                {
                                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(url) { UseShellExecute = true });
                                }
                            }
                            catch { }
                            return;
                        }

                        if (msg == "light" || msg == "dark" || msg == "oled")
                        {
                            // 28ms delay aligns seamlessly with the perceptual midpoint of the 100ms CSS transition
                            await Task.Delay(28);
                            SetDwmTheme(msg);
                            return;
                        }
                    }
                    catch { }
                };

                webView.NavigationCompleted += (s, e) =>
                {
                    try { webView.Focus(); } catch { }
                    if (isTearOff)
                    {
                        try { ForceForegroundWindow(this.Handle); } catch { }
                    }
                    try
                    {
                        if (!string.IsNullOrEmpty(targetFile) && File.Exists(targetFile))
                        {
                            ReadAndSendFileContent(targetFile);
                            string dir = Path.GetDirectoryName(targetFile);
                            if (!string.IsNullOrEmpty(dir) && Directory.Exists(dir))
                            {
                                ScanAndSendWorkspaceTree(dir);
                            }
                        }
                    }
                    catch { }
                };

                string indexHtmlUrl = "file:///" + Path.Combine(appDir, "index.html").Replace('\\', '/');
                if (!string.IsNullOrEmpty(sessionId))
                {
                    indexHtmlUrl += "#s=" + sessionId;
                }

                webView.CoreWebView2.Navigate(indexHtmlUrl);
            }
            catch (Exception ex)
            {
                MessageBox.Show("WebView2 motoru başlatılamadı: " + ex.Message, "NeoText Hatası", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void SetupWatcher()
        {
            try
            {
                string dir = Path.GetDirectoryName(targetFile);
                string fileName = Path.GetFileName(targetFile);

                watcher = new FileSystemWatcher(dir, fileName)
                {
                    NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.Size
                };

                DateTime lastRead = DateTime.MinValue;
                watcher.Changed += (s, e) =>
                {
                    try
                    {
                        if ((DateTime.Now - lastRead).TotalMilliseconds < 350) return;
                        lastRead = DateTime.Now;

                        Thread.Sleep(80);
                        UpdateDataFiles(true);

                        if (webView != null && webView.CoreWebView2 != null)
                        {
                            this.BeginInvoke(new Action(() =>
                            {
                                try
                                {
                                    webView.CoreWebView2.ExecuteScriptAsync("window.__NEOTEXT_RELOAD_REQ__ = window.__NEOMD_RELOAD_REQ__ = true;");
                                }
                                catch { }
                            }));
                        }
                    }
                    catch { }
                };

                watcher.EnableRaisingEvents = true;
            }
            catch { }
        }

        private void SaveContentToFile(string content)
        {
            try
            {
                if (string.IsNullOrEmpty(targetFile)) return;

                if (watcher != null) watcher.EnableRaisingEvents = false;

                UTF8Encoding utf8WithoutBom = new UTF8Encoding(false);
                File.WriteAllText(targetFile, content, utf8WithoutBom);
                hasUnsavedChanges = false;

                UpdateDataFiles(false);

                Task.Delay(350).ContinueWith(t =>
                {
                    try
                    {
                        if (watcher != null) watcher.EnableRaisingEvents = true;
                    }
                    catch { }
                });

                if (isSavingAndExiting)
                {
                    this.BeginInvoke(new Action(() => this.Close()));
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Dosya kaydedilemedi: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void HandleSaveAs(string content, string suggestedName = null)
        {
            try
            {
                using (SaveFileDialog sfd = new SaveFileDialog())
                {
                    string currentExt = ".md";
                    if (!string.IsNullOrEmpty(suggestedName))
                    {
                        string ext = Path.GetExtension(suggestedName).ToLower();
                        if (!string.IsNullOrEmpty(ext)) currentExt = ext;
                    }
                    else if (!string.IsNullOrEmpty(targetFile))
                    {
                        string ext = Path.GetExtension(targetFile).ToLower();
                        if (!string.IsNullOrEmpty(ext)) currentExt = ext;
                    }
                    string txtFilter, mdFilter, allFilter, defaultDoc;

                    switch (currentLang)
                    {
                        case "tr":
                            txtFilter = "Metin Belgeleri (*.txt)|*.txt";
                            mdFilter = "Markdown Belgeleri (*.md)|*.md";
                            allFilter = "Tüm Dosyalar (*.*)|*.*";
                            defaultDoc = "Belge";
                            break;
                        case "de":
                            txtFilter = "Textdateien (*.txt)|*.txt";
                            mdFilter = "Markdown-Dokumente (*.md)|*.md";
                            allFilter = "Alle Dateien (*.*)|*.*";
                            defaultDoc = "Dokument";
                            break;
                        case "ar":
                            txtFilter = "مستندات نصية (*.txt)|*.txt";
                            mdFilter = "مستندات ماركداون (*.md)|*.md";
                            allFilter = "جميع الملفات (*.*)|*.*";
                            defaultDoc = "مستند";
                            break;
                        case "fr":
                            txtFilter = "Documents texte (*.txt)|*.txt";
                            mdFilter = "Documents Markdown (*.md)|*.md";
                            allFilter = "Tous les fichiers (*.*)|*.*";
                            defaultDoc = "Document";
                            break;
                        case "es":
                            txtFilter = "Documentos de texto (*.txt)|*.txt";
                            mdFilter = "Documentos de Markdown (*.md)|*.md";
                            allFilter = "Todos los archivos (*.*)|*.*";
                            defaultDoc = "Documento";
                            break;
                        case "it":
                            txtFilter = "Documenti di testo (*.txt)|*.txt";
                            mdFilter = "Documenti Markdown (*.md)|*.md";
                            allFilter = "Tutti i file (*.*)|*.*";
                            defaultDoc = "Documento";
                            break;
                        default:
                            txtFilter = "Text Documents (*.txt)|*.txt";
                            mdFilter = "Markdown Documents (*.md)|*.md";
                            allFilter = "All Files (*.*)|*.*";
                            defaultDoc = "Document";
                            break;
                    }

                    if (currentExt == ".txt")
                    {
                        sfd.Filter = txtFilter + "|" + mdFilter + "|" + allFilter;
                        sfd.DefaultExt = "txt";
                    }
                    else
                    {
                        sfd.Filter = mdFilter + "|" + txtFilter + "|" + allFilter;
                        sfd.DefaultExt = "md";
                    }

                    if (!string.IsNullOrEmpty(suggestedName))
                    {
                        sfd.FileName = suggestedName;
                        if (!string.IsNullOrEmpty(targetFile))
                        {
                            try { sfd.InitialDirectory = Path.GetDirectoryName(targetFile); } catch { }
                        }
                    }
                    else if (!string.IsNullOrEmpty(targetFile))
                    {
                        sfd.InitialDirectory = Path.GetDirectoryName(targetFile);
                        sfd.FileName = Path.GetFileName(targetFile);
                    }
                    else
                    {
                        sfd.FileName = defaultDoc + currentExt;
                    }

                    if (sfd.ShowDialog(this) == DialogResult.OK)
                    {
                        if (watcher != null)
                        {
                            watcher.EnableRaisingEvents = false;
                            watcher.Dispose();
                            watcher = null;
                        }

                        this.targetFile = sfd.FileName;
                        UTF8Encoding utf8WithoutBom = new UTF8Encoding(false);
                        File.WriteAllText(this.targetFile, content, utf8WithoutBom);
                        hasUnsavedChanges = false;

                        UpdateDataFiles(false);
                        SetupWatcher();

                        FileInfo fi = new FileInfo(this.targetFile);
                        this.Text = fi.Name + " - NeoText";

                        if (webView != null && webView.CoreWebView2 != null)
                        {
                            string escapedPath = EscapeJson(this.targetFile);
                            string escapedName = EscapeJson(fi.Name);
                            string script = string.Format(
                                "if (window.__NEOTEXT_ON_SAVE_AS_SUCCESS__) {{ window.__NEOTEXT_ON_SAVE_AS_SUCCESS__(\"{0}\", \"{1}\"); }} else if (window.__NEOMD_ON_SAVE_AS_SUCCESS__) {{ window.__NEOMD_ON_SAVE_AS_SUCCESS__(\"{0}\", \"{1}\"); }}",
                                escapedPath, escapedName
                            );
                            webView.CoreWebView2.ExecuteScriptAsync(script);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Farklı kaydetme işlemi gerçekleştirilemedi: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void HandleSaveConvertedFile(string suggestedName, string content, string targetExt)
        {
            try
            {
                using (SaveFileDialog sfd = new SaveFileDialog())
                {
                    string txtFilter, mdFilter, allFilter;

                    switch (currentLang)
                    {
                        case "tr":
                            txtFilter = "Metin Belgeleri (*.txt)|*.txt";
                            mdFilter = "Markdown Belgeleri (*.md)|*.md";
                            allFilter = "Tüm Dosyalar (*.*)|*.*";
                            break;
                        case "de":
                            txtFilter = "Textdateien (*.txt)|*.txt";
                            mdFilter = "Markdown-Dokumente (*.md)|*.md";
                            allFilter = "Alle Dateien (*.*)|*.*";
                            break;
                        case "ar":
                            txtFilter = "مستندات نصية (*.txt)|*.txt";
                            mdFilter = "مستندات ماركداون (*.md)|*.md";
                            allFilter = "جميع الملفات (*.*)|*.*";
                            break;
                        case "fr":
                            txtFilter = "Documents texte (*.txt)|*.txt";
                            mdFilter = "Documents Markdown (*.md)|*.md";
                            allFilter = "Tous les fichiers (*.*)|*.*";
                            break;
                        case "es":
                            txtFilter = "Documentos de texto (*.txt)|*.txt";
                            mdFilter = "Documentos de Markdown (*.md)|*.md";
                            allFilter = "Todos los archivos (*.*)|*.*";
                            break;
                        case "it":
                            txtFilter = "Documenti di testo (*.txt)|*.txt";
                            mdFilter = "Documenti Markdown (*.md)|*.md";
                            allFilter = "Tutti i file (*.*)|*.*";
                            break;
                        default:
                            txtFilter = "Text Documents (*.txt)|*.txt";
                            mdFilter = "Markdown Documents (*.md)|*.md";
                            allFilter = "All Files (*.*)|*.*";
                            break;
                    }

                    if (targetExt == ".txt")
                    {
                        sfd.Filter = txtFilter + "|" + allFilter;
                        sfd.DefaultExt = "txt";
                    }
                    else
                    {
                        sfd.Filter = mdFilter + "|" + allFilter;
                        sfd.DefaultExt = "md";
                    }

                    if (!string.IsNullOrEmpty(targetFile))
                    {
                        sfd.InitialDirectory = Path.GetDirectoryName(targetFile);
                    }
                    sfd.FileName = suggestedName;

                    if (sfd.ShowDialog(this) == DialogResult.OK)
                    {
                        if (watcher != null)
                        {
                            watcher.EnableRaisingEvents = false;
                            watcher.Dispose();
                            watcher = null;
                        }

                        this.targetFile = sfd.FileName;
                        UTF8Encoding utf8WithoutBom = new UTF8Encoding(false);
                        File.WriteAllText(this.targetFile, content, utf8WithoutBom);
                        hasUnsavedChanges = false;

                        UpdateDataFiles(false);
                        SetupWatcher();

                        FileInfo fi = new FileInfo(this.targetFile);
                        this.Text = fi.Name + " - NeoText";

                        if (webView != null && webView.CoreWebView2 != null)
                        {
                            string escapedPath = EscapeJson(this.targetFile);
                            string escapedName = EscapeJson(fi.Name);
                            string script = string.Format(
                                "if (window.__NEOTEXT_ON_SAVE_AS_SUCCESS__) {{ window.__NEOTEXT_ON_SAVE_AS_SUCCESS__(\"{0}\", \"{1}\"); }} else if (window.__NEOMD_ON_SAVE_AS_SUCCESS__) {{ window.__NEOMD_ON_SAVE_AS_SUCCESS__(\"{0}\", \"{1}\"); }}",
                                escapedPath, escapedName
                            );
                            webView.CoreWebView2.ExecuteScriptAsync(script);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Dönüştürme işlemi kaydedilemedi: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void UpdateDataFiles(bool isReload)
        {
            try
            {
                string content = "";
                using (FileStream fs = new FileStream(targetFile, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                using (StreamReader sr = new StreamReader(fs, Encoding.UTF8))
                {
                    content = sr.ReadToEnd();
                }

                FileInfo fi = new FileInfo(targetFile);
                string escapedContent = EscapeJson(content);
                string escapedPath = targetFile.Replace("\\", "\\\\");
                string escapedName = EscapeJson(fi.Name);

                StringBuilder sb = new StringBuilder();
                sb.Append("window.__NEOTEXT_DATA__ = window.__NEOMD_DATA__ = {");
                if (!string.IsNullOrEmpty(sessionId))
                {
                    sb.AppendFormat("sessionId: \"{0}\",", sessionId);
                }
                sb.AppendFormat("filePath: \"{0}\",", escapedPath);
                sb.AppendFormat("fileName: \"{0}\",", escapedName);
                sb.AppendFormat("lastModified: {0},", fi.LastWriteTimeUtc.Ticks);
                sb.AppendFormat("content: \"{0}\"", escapedContent);
                sb.Append("};\n");

                if (isReload)
                {
                    sb.Append("window.__NEOTEXT_RELOAD_REQ__ = window.__NEOMD_RELOAD_REQ__ = true;\n");
                }

                UTF8Encoding utf8WithoutBom = new UTF8Encoding(false);
                try
                {
                    if (!string.IsNullOrEmpty(sessionJs))
                    {
                        string sDir = Path.GetDirectoryName(sessionJs);
                        if (!Directory.Exists(sDir)) Directory.CreateDirectory(sDir);
                        File.WriteAllText(sessionJs, sb.ToString(), utf8WithoutBom);
                    }
                }
                catch { }

                try
                {
                    if (!string.IsNullOrEmpty(activeDataJs))
                    {
                        string aDir = Path.GetDirectoryName(activeDataJs);
                        if (!Directory.Exists(aDir)) Directory.CreateDirectory(aDir);
                        File.WriteAllText(activeDataJs, sb.ToString(), utf8WithoutBom);
                    }
                }
                catch { }
            }
            catch { }
        }

        private void OpenWorkspaceFolderDialog()
        {
            try
            {
                using (FolderBrowserDialog fbd = new FolderBrowserDialog())
                {
                    fbd.Description = currentLang == "tr" ? "NeoText - Çalışma Alanı / Notlar Klasörünü Seçin" : "NeoMD - Select Workspace Folder";
                    fbd.ShowNewFolderButton = true;
                    if (!string.IsNullOrEmpty(currentWorkspaceDir) && Directory.Exists(currentWorkspaceDir))
                    {
                        fbd.SelectedPath = currentWorkspaceDir;
                    }
                    else if (!string.IsNullOrEmpty(targetFile) && File.Exists(targetFile))
                    {
                        fbd.SelectedPath = Path.GetDirectoryName(targetFile);
                    }

                    if (fbd.ShowDialog(this) == DialogResult.OK)
                    {
                        string selected = fbd.SelectedPath;
                        currentWorkspaceDir = selected;
                        ScanAndSendWorkspaceTree(selected);
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Klasör açılamadı: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void OpenFileDialogPrompt()
        {
            try
            {
                using (OpenFileDialog ofd = new OpenFileDialog())
                {
                    ofd.Title = currentLang == "tr" ? "NeoText - Dosya Aç" : "NeoText - Open Document";
                    ofd.Filter = currentLang == "tr"
                        ? "Markdown ve Metin Dosyaları (*.md;*.markdown;*.txt)|*.md;*.markdown;*.txt|Markdown Dosyaları (*.md;*.markdown)|*.md;*.markdown|Metin Dosyaları (*.txt)|*.txt|Tüm Dosyalar (*.*)|*.*"
                        : "Markdown & Text Files (*.md;*.markdown;*.txt)|*.md;*.markdown;*.txt|Markdown Files (*.md;*.markdown)|*.md;*.markdown|Text Files (*.txt)|*.txt|All Files (*.*)|*.*";
                    ofd.FilterIndex = 1;
                    ofd.CheckFileExists = true;
                    ofd.Multiselect = true;

                    if (!string.IsNullOrEmpty(currentWorkspaceDir) && Directory.Exists(currentWorkspaceDir))
                    {
                        ofd.InitialDirectory = currentWorkspaceDir;
                    }
                    else if (!string.IsNullOrEmpty(targetFile) && File.Exists(targetFile))
                    {
                        ofd.InitialDirectory = Path.GetDirectoryName(targetFile);
                    }

                    if (ofd.ShowDialog(this) == DialogResult.OK)
                    {
                        string firstDir = null;
                        foreach (string file in ofd.FileNames)
                        {
                            if (firstDir == null) firstDir = Path.GetDirectoryName(file);
                            ReadAndSendFileContent(file);
                        }

                        if (!string.IsNullOrEmpty(firstDir) && Directory.Exists(firstDir))
                        {
                            currentWorkspaceDir = firstDir;
                            ScanAndSendWorkspaceTree(firstDir);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Dosya açılamadı: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private static readonly HashSet<string> IgnoredWorkspaceFolders = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "node_modules", ".git", ".vs", "bin", "obj",
            "$recycle.bin", "system volume information", "recovery", "perflogs",
            "windows", "program files", "program files (x86)", "programdata", "appdata"
        };

        private void SetupWorkspaceWatcher(string folderPath, bool isDriveRoot)
        {
            try
            {
                if (workspaceWatcher != null)
                {
                    workspaceWatcher.EnableRaisingEvents = false;
                    workspaceWatcher.Dispose();
                    workspaceWatcher = null;
                }

                if (!Directory.Exists(folderPath)) return;

                workspaceWatcher = new FileSystemWatcher(folderPath);
                workspaceWatcher.IncludeSubdirectories = !isDriveRoot;
                workspaceWatcher.NotifyFilter = NotifyFilters.FileName | NotifyFilters.DirectoryName | NotifyFilters.LastWrite;

                DateTime lastScan = DateTime.MinValue;
                FileSystemEventHandler changeHandler = delegate(object s, FileSystemEventArgs e)
                {
                    try
                    {
                        if ((DateTime.Now - lastScan).TotalMilliseconds < 600) return;
                        lastScan = DateTime.Now;
                        Thread.Sleep(100);
                        ScanAndSendWorkspaceTree(folderPath);
                    }
                    catch { }
                };

                workspaceWatcher.Created += changeHandler;
                workspaceWatcher.Deleted += changeHandler;
                workspaceWatcher.Renamed += delegate(object s, RenamedEventArgs e) { changeHandler(s, e); };
                workspaceWatcher.EnableRaisingEvents = true;
            }
            catch { }
        }

        private void ScanAndSendWorkspaceTree(string folderPath)
        {
            if (string.IsNullOrEmpty(folderPath) || !Directory.Exists(folderPath)) return;

            Task.Run(() =>
            {
                try
                {
                    bool isDriveRoot = false;
                    try
                    {
                        string root = Path.GetPathRoot(folderPath);
                        if (!string.IsNullOrEmpty(root) && root.TrimEnd('\\').Equals(folderPath.TrimEnd('\\'), StringComparison.OrdinalIgnoreCase))
                        {
                            isDriveRoot = true;
                        }
                    }
                    catch { }

                    this.BeginInvoke(new Action(() =>
                    {
                        try { SetupWorkspaceWatcher(folderPath, isDriveRoot); } catch { }
                    }));

                    DirectoryInfo rootDi = new DirectoryInfo(folderPath);
                    string displayName = rootDi.Name;
                    if (string.IsNullOrEmpty(displayName) || displayName.Contains(":") || isDriveRoot)
                    {
                        displayName = !string.IsNullOrEmpty(rootDi.FullName) ? rootDi.FullName.TrimEnd('\\') : "Sürücü";
                    }

                    StringBuilder jsonBuilder = new StringBuilder();
                    int nodeCount = 0;
                    int maxDepth = isDriveRoot ? 2 : 4;
                    BuildDirectoryJson(rootDi, jsonBuilder, 0, ref nodeCount, 600, maxDepth);

                    string treeJson = jsonBuilder.ToString();
                    string escapedFolderPath = EscapeJson(folderPath);
                    string escapedFolderName = EscapeJson(displayName);

                    this.BeginInvoke(new Action(() =>
                    {
                        try
                        {
                            if (webView != null && webView.CoreWebView2 != null)
                            {
                                string json = string.Format(
                                    "{{\"type\":\"workspace_tree\",\"folderPath\":\"{0}\",\"folderName\":\"{1}\",\"tree\":{2}}}",
                                    escapedFolderPath, escapedFolderName, treeJson
                                );
                                webView.CoreWebView2.PostWebMessageAsJson(json);

                                string script = string.Format(
                                    "if (window.__NEOTEXT_ON_WORKSPACE_LOADED__) {{ window.__NEOTEXT_ON_WORKSPACE_LOADED__({{ folderPath: \"{0}\", folderName: \"{1}\", tree: {2} }}); }} else if (window.__NEOMD_ON_WORKSPACE_LOADED__) {{ window.__NEOMD_ON_WORKSPACE_LOADED__({{ folderPath: \"{0}\", folderName: \"{1}\", tree: {2} }}); }}",
                                    escapedFolderPath, escapedFolderName, treeJson
                                );
                                webView.CoreWebView2.ExecuteScriptAsync(script);
                            }
                        }
                        catch { }
                    }));
                }
                catch { }
            });
        }

        private void BuildDirectoryJson(DirectoryInfo dir, StringBuilder sb, int depth, ref int nodeCount, int maxNodes, int maxDepth)
        {
            sb.Append("{");
            string dirName = dir.Name;
            if (string.IsNullOrEmpty(dirName) || dirName.Contains(":"))
            {
                dirName = dir.FullName.TrimEnd('\\');
            }
            sb.AppendFormat("\"name\":\"{0}\",", EscapeJson(dirName));
            sb.AppendFormat("\"path\":\"{0}\",", EscapeJson(dir.FullName));
            sb.Append("\"isDirectory\":true,");
            sb.Append("\"children\":[");

            if (depth < maxDepth && nodeCount < maxNodes)
            {
                bool first = true;
                try
                {
                    DirectoryInfo[] subDirs = dir.GetDirectories();
                    Array.Sort(subDirs, delegate(DirectoryInfo a, DirectoryInfo b) {
                        return string.Compare(a.Name, b.Name, StringComparison.OrdinalIgnoreCase);
                    });
                    foreach (DirectoryInfo subDir in subDirs)
                    {
                        if (nodeCount >= maxNodes) break;
                        string name = subDir.Name;
                        if (name.StartsWith(".") || (subDir.Attributes & FileAttributes.Hidden) != 0 || (subDir.Attributes & FileAttributes.System) != 0)
                        {
                            continue;
                        }
                        if (IgnoredWorkspaceFolders.Contains(name))
                        {
                            continue;
                        }

                        if (!first) sb.Append(",");
                        first = false;
                        nodeCount++;
                        BuildDirectoryJson(subDir, sb, depth + 1, ref nodeCount, maxNodes, maxDepth);
                    }
                }
                catch { }

                try
                {
                    FileInfo[] files = dir.GetFiles();
                    Array.Sort(files, delegate(FileInfo a, FileInfo b) {
                        return string.Compare(a.Name, b.Name, StringComparison.OrdinalIgnoreCase);
                    });
                    foreach (FileInfo file in files)
                    {
                        if (nodeCount >= maxNodes) break;
                        string ext = file.Extension.ToLowerInvariant();
                        if (file.Name.StartsWith(".") || (file.Attributes & FileAttributes.Hidden) != 0 || (file.Attributes & FileAttributes.System) != 0)
                        {
                            continue;
                        }

                        if (!first) sb.Append(",");
                        first = false;
                        nodeCount++;

                        sb.Append("{");
                        sb.AppendFormat("\"name\":\"{0}\",", EscapeJson(file.Name));
                        sb.AppendFormat("\"path\":\"{0}\",", EscapeJson(file.FullName));
                        sb.Append("\"isDirectory\":false,");
                        sb.AppendFormat("\"ext\":\"{0}\",", EscapeJson(ext));
                        sb.AppendFormat("\"size\":{0}", file.Length);
                        sb.Append("}");
                    }
                }
                catch { }
            }

            sb.Append("]}");
        }

        private void ReadAndSendFileContent(string filePath)
        {
            try
            {
                if (!File.Exists(filePath)) return;

                string content = "";
                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
                using (StreamReader sr = new StreamReader(fs, Encoding.UTF8))
                {
                    content = sr.ReadToEnd();
                }

                FileInfo fi = new FileInfo(filePath);
                string escapedContent = EscapeJson(content);
                string escapedPath = EscapeJson(filePath);
                string escapedName = EscapeJson(fi.Name);

                if (webView != null && webView.CoreWebView2 != null)
                {
                    string json = string.Format(
                        "{{\"type\":\"open_file_content\",\"filePath\":\"{0}\",\"fileName\":\"{1}\",\"content\":\"{2}\"}}",
                        escapedPath, escapedName, escapedContent
                    );
                    webView.CoreWebView2.PostWebMessageAsJson(json);

                    string script = string.Format(
                        "if (window.__NEOTEXT_ON_FILE_READ__) {{ window.__NEOTEXT_ON_FILE_READ__({{ filePath: \"{0}\", fileName: \"{1}\", content: \"{2}\" }}); }} else if (window.__NEOMD_ON_FILE_READ__) {{ window.__NEOMD_ON_FILE_READ__({{ filePath: \"{0}\", fileName: \"{1}\", content: \"{2}\" }}); }}",
                        escapedPath, escapedName, escapedContent
                    );
                    try { webView.CoreWebView2.ExecuteScriptAsync(script); } catch { }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Dosya okunamadı: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void TearOffTab(string payload)
        {
            try
            {
                string tearPath = "";
                string tearName = "";
                string tearContent = "";
                bool isDirty = false;
                int screenX = -1;
                int screenY = -1;

                if (!string.IsNullOrEmpty(payload) && payload.StartsWith("{"))
                {
                    tearPath = ExtractJsonField(payload, "filePath");
                    tearName = ExtractJsonField(payload, "fileName");
                    tearContent = ExtractJsonField(payload, "content");
                    isDirty = ExtractJsonBool(payload, "isDirty", false);
                    screenX = ExtractJsonInt(payload, "screenX", -1);
                    screenY = ExtractJsonInt(payload, "screenY", -1);
                }
                else
                {
                    string[] parts = (payload ?? "").Split(new char[] { '|' }, 3);
                    tearPath = parts.Length > 0 ? parts[0] : "";
                    tearName = parts.Length > 1 ? parts[1] : "";
                    tearContent = parts.Length > 2 ? parts[2] : "";
                }

                if (tearPath == "undefined") tearPath = "";
                if (string.IsNullOrEmpty(tearName)) tearName = "Yeni Belge.md";

                string sessionId = "tear_" + DateTime.Now.Ticks.ToString("x");
                string sessionDir = Path.Combine(profileDir, "sessions");
                try { if (!Directory.Exists(sessionDir)) Directory.CreateDirectory(sessionDir); } catch { }
                string sessionFile = Path.Combine(sessionDir, sessionId + ".js");

                string escapedContent = EscapeJson(tearContent);
                string escapedName = EscapeJson(tearName);
                string escapedPath = EscapeJson(tearPath);
                string jsData = string.Format(
                    "window.__NEOTEXT_DATA__ = window.__NEOMD_DATA__ = {{ filePath: \"{0}\", fileName: \"{1}\", content: \"{2}\", rawMarkdown: \"{2}\", isDirty: {3} }};",
                    escapedPath, escapedName, escapedContent, isDirty ? "true" : "false"
                );
                File.WriteAllText(sessionFile, jsData, Encoding.UTF8);

                string args = "--new-window --session " + sessionId;
                if (screenX >= 0 && screenY >= 0)
                {
                    args += string.Format(" --x {0} --y {1}", screenX, screenY);
                }

                try { AllowSetForegroundWindow(-1); } catch { }
                Process p = Process.Start(Application.ExecutablePath, args);
                if (p != null)
                {
                    try { AllowSetForegroundWindow(p.Id); } catch { }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Yeni pencere açılamadı: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void SaveExternalOpenMode(bool inTab)
        {
            try
            {
                string userSettings = Path.Combine(profileDir, "app_settings.json");
                string settingsPath = File.Exists(userSettings) ? userSettings : Path.Combine(appDir, "app_settings.json");
                bool hasShown = false;
                string channelVal = (appDir.IndexOf("WindowsApps", StringComparison.OrdinalIgnoreCase) >= 0) ? "store" : "store";
                if (File.Exists(settingsPath))
                {
                    string existing = File.ReadAllText(settingsPath);
                    if (existing.IndexOf("\"hasShownIntroduction\":true", StringComparison.OrdinalIgnoreCase) >= 0 ||
                        existing.IndexOf("\"hasShownIntroduction\": true", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        hasShown = true;
                    }
                    if (existing.IndexOf("\"distribution_channel\":\"github\"", StringComparison.OrdinalIgnoreCase) >= 0 ||
                        existing.IndexOf("\"distribution_channel\": \"github\"", StringComparison.OrdinalIgnoreCase) >= 0)
                    {
                        channelVal = "github";
                    }
                }
                string targetSavePath = (appDir.IndexOf("WindowsApps", StringComparison.OrdinalIgnoreCase) >= 0) ? userSettings : settingsPath;
                string json = string.Format("{{\"openExternalInTabs\": {0}, \"hasShownIntroduction\": {1}, \"distribution_channel\": \"{2}\"}}", inTab ? "true" : "false", hasShown ? "true" : "false", channelVal);
                string dir = Path.GetDirectoryName(targetSavePath);
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);
                File.WriteAllText(targetSavePath, json, Encoding.UTF8);
            }
            catch { }
        }

        private void SaveTabFile(string filePath, string content)
        {
            try
            {
                if (string.IsNullOrEmpty(filePath)) return;

                bool isTargetFile = string.Equals(targetFile, filePath, StringComparison.OrdinalIgnoreCase);
                if (isTargetFile && watcher != null) watcher.EnableRaisingEvents = false;

                UTF8Encoding utf8WithoutBom = new UTF8Encoding(false);
                File.WriteAllText(filePath, content, utf8WithoutBom);

                if (isTargetFile)
                {
                    hasUnsavedChanges = false;
                    UpdateDataFiles(false);
                    Task.Delay(350).ContinueWith(delegate(Task t)
                    {
                        try { if (watcher != null) watcher.EnableRaisingEvents = true; } catch { }
                    });
                }

                if (webView != null && webView.CoreWebView2 != null)
                {
                    string script = string.Format(
                        "if (window.__NEOTEXT_ON_TAB_SAVED__) {{ window.__NEOTEXT_ON_TAB_SAVED__(\"{0}\"); }} else if (window.__NEOMD_ON_TAB_SAVED__) {{ window.__NEOMD_ON_TAB_SAVED__(\"{0}\"); }}",
                        EscapeJson(filePath)
                    );
                    webView.CoreWebView2.ExecuteScriptAsync(script);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Dosya kaydedilemedi: " + ex.Message, "NeoText", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        private void SaveClipboardImage(string payload)
        {
            try
            {
                string[] parts = payload.Split('|');
                if (parts.Length < 3) return;

                string folder = parts[0];
                string rawFilename = parts[1];
                string base64Data = parts[2];

                // Sanitize filename to prevent path traversal
                string filename = Path.GetFileName(rawFilename);
                string ext = Path.GetExtension(filename).ToLowerInvariant();
                string[] allowedExts = new string[] { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp" };
                bool isAllowed = false;
                foreach (string allowed in allowedExts)
                {
                    if (ext == allowed) { isAllowed = true; break; }
                }
                if (!isAllowed) filename += ".png";

                if (base64Data.Contains(","))
                {
                    base64Data = base64Data.Substring(base64Data.IndexOf(',') + 1);
                }

                string safeFolder = Path.GetFullPath(folder);
                if (!Directory.Exists(safeFolder))
                {
                    Directory.CreateDirectory(safeFolder);
                }

                string fullPath = Path.Combine(safeFolder, filename);
                if (!fullPath.StartsWith(safeFolder, StringComparison.OrdinalIgnoreCase))
                {
                    return; // Path traversal blocked
                }

                byte[] bytes = Convert.FromBase64String(base64Data);
                File.WriteAllBytes(fullPath, bytes);

                string relativePath = "assets/" + filename;
                if (webView != null && webView.CoreWebView2 != null)
                {
                    string script = string.Format(
                        "if (window.__NEOTEXT_ON_IMAGE_SAVED__) {{ window.__NEOTEXT_ON_IMAGE_SAVED__({{ success: true, relativePath: \"{0}\", fullPath: \"{1}\" }}); }} else if (window.__NEOMD_ON_IMAGE_SAVED__) {{ window.__NEOMD_ON_IMAGE_SAVED__({{ success: true, relativePath: \"{0}\", fullPath: \"{1}\" }}); }}",
                        EscapeJson(relativePath), EscapeJson(fullPath)
                    );
                    webView.CoreWebView2.ExecuteScriptAsync(script);
                }
            }
            catch (Exception ex)
            {
                if (webView != null && webView.CoreWebView2 != null)
                {
                    string script = string.Format(
                        "if (window.__NEOTEXT_ON_IMAGE_SAVED__) {{ window.__NEOTEXT_ON_IMAGE_SAVED__({{ success: false, error: \"{0}\" }}); }} else if (window.__NEOMD_ON_IMAGE_SAVED__) {{ window.__NEOMD_ON_IMAGE_SAVED__({{ success: false, error: \"{0}\" }}); }}",
                        EscapeJson(ex.Message)
                    );
                    webView.CoreWebView2.ExecuteScriptAsync(script);
                }
            }
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (watcher != null) watcher.Dispose();
                if (workspaceWatcher != null) workspaceWatcher.Dispose();
                if (webView != null) webView.Dispose();
            }
            base.Dispose(disposing);
        }

                public static bool IsValidSafeWebUrl(string url)
        {
            if (string.IsNullOrEmpty(url)) return false;
            Uri uri;
            if (Uri.TryCreate(url, UriKind.Absolute, out uri))
            {
                return uri.Scheme == Uri.UriSchemeHttp ||
                       uri.Scheme == Uri.UriSchemeHttps ||
                       uri.Scheme == Uri.UriSchemeMailto ||
                       uri.Scheme.Equals("ms-windows-store", StringComparison.OrdinalIgnoreCase);
            }
            return false;
        }

        private static string EscapeJson(string s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            StringBuilder sb = new StringBuilder();
            foreach (char c in s)
            {
                switch (c)
                {
                    case '\\': sb.Append("\\\\"); break;
                    case '\"': sb.Append("\\\""); break;
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    case '\b': sb.Append("\\b"); break;
                    case '\f': sb.Append("\\f"); break;
                    default:
                        if (c < ' ') sb.AppendFormat("\\u{0:x4}", (int)c);
                        else sb.Append(c);
                        break;
                }
            }
            return sb.ToString();
        }

        private static string ExtractJsonField(string json, string field)
        {
            if (string.IsNullOrEmpty(json)) return "";
            try
            {
                string pattern = "\"" + field + "\"\\s*:\\s*\"((?:\\\\\"|[^\"])*)\"";
                var match = System.Text.RegularExpressions.Regex.Match(json, pattern);
                if (match.Success)
                {
                    return UnescapeJson(match.Groups[1].Value);
                }
            }
            catch { }
            return "";
        }

        private static int ExtractJsonInt(string json, string field, int defVal = -1)
        {
            if (string.IsNullOrEmpty(json)) return defVal;
            try
            {
                string pattern = "\"" + field + "\"\\s*:\\s*(-?\\d+)";
                var match = System.Text.RegularExpressions.Regex.Match(json, pattern);
                if (match.Success)
                {
                    int val;
                    if (int.TryParse(match.Groups[1].Value, out val)) return val;
                }
            }
            catch { }
            return defVal;
        }

        private static bool ExtractJsonBool(string json, string field, bool defVal = false)
        {
            if (string.IsNullOrEmpty(json)) return defVal;
            try
            {
                string pattern = "\"" + field + "\"\\s*:\\s*(true|false)";
                var match = System.Text.RegularExpressions.Regex.Match(json, pattern, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    return match.Groups[1].Value.ToLower() == "true";
                }
            }
            catch { }
            return defVal;
        }

        private static string UnescapeJson(string s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < s.Length; i++)
            {
                if (s[i] == '\\' && i + 1 < s.Length)
                {
                    char next = s[i + 1];
                    switch (next)
                    {
                        case 'n': sb.Append('\n'); i++; break;
                        case 'r': sb.Append('\r'); i++; break;
                        case 't': sb.Append('\t'); i++; break;
                        case 'b': sb.Append('\b'); i++; break;
                        case 'f': sb.Append('\f'); i++; break;
                        case '"': sb.Append('"'); i++; break;
                        case '\\': sb.Append('\\'); i++; break;
                        case 'u':
                            if (i + 5 < s.Length)
                            {
                                string hex = s.Substring(i + 2, 4);
                                int code;
                                if (int.TryParse(hex, System.Globalization.NumberStyles.HexNumber, null, out code))
                                {
                                    sb.Append((char)code);
                                    i += 5;
                                    break;
                                }
                            }
                            sb.Append(s[i]);
                            break;
                        default:
                            sb.Append(s[i]);
                            break;
                    }
                }
                else
                {
                    sb.Append(s[i]);
                }
            }
            return sb.ToString();
        }
    }

    public static class DarkMessageBox
    {
        [DllImport("dwmapi.dll", PreserveSig = true)]
        private static extern int DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        public static DialogResult Show(
            IWin32Window owner,
            string text,
            string caption,
            MessageBoxButtons buttons = MessageBoxButtons.YesNo,
            bool isDark = true,
            string btn1Text = null,
            string btn2Text = null,
            string btn3Text = null)
        {
            using (Form form = new Form())
            {
                form.Text = caption;
                form.FormBorderStyle = FormBorderStyle.FixedDialog;
                form.MaximizeBox = false;
                form.MinimizeBox = false;
                form.ShowInTaskbar = false;
                form.StartPosition = (owner != null) ? FormStartPosition.CenterParent : FormStartPosition.CenterScreen;
                form.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);

                Color bg = isDark ? Color.FromArgb(28, 28, 28) : Color.FromArgb(248, 248, 248);
                Color fg = isDark ? Color.FromArgb(230, 237, 243) : Color.FromArgb(31, 35, 40);
                Color btnBg = isDark ? Color.FromArgb(42, 42, 42) : Color.FromArgb(238, 238, 238);
                Color btnBorder = isDark ? Color.FromArgb(62, 62, 62) : Color.FromArgb(208, 215, 222);
                Color btnHover = isDark ? Color.FromArgb(55, 55, 55) : Color.FromArgb(228, 228, 228);
                Color primaryBg = isDark ? Color.FromArgb(37, 99, 235) : Color.FromArgb(9, 105, 218);
                Color primaryHover = isDark ? Color.FromArgb(59, 130, 246) : Color.FromArgb(3, 102, 214);

                form.BackColor = bg;
                form.ForeColor = fg;

                // Circular Icon Box
                PictureBox iconBox = new PictureBox();
                iconBox.Size = new Size(36, 36);
                iconBox.Location = new Point(22, 22);
                Bitmap bmp = new Bitmap(36, 36);
                using (Graphics g = Graphics.FromImage(bmp))
                {
                    g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
                    g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;
                    using (Brush b = new SolidBrush(Color.FromArgb(2, 132, 199)))
                    {
                        g.FillEllipse(b, 1, 1, 34, 34);
                    }
                    using (Font qFont = new Font("Segoe UI", 15f, FontStyle.Bold))
                    using (Brush qBrush = new SolidBrush(Color.White))
                    using (StringFormat sf = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
                    {
                        g.DrawString("?", qFont, qBrush, new RectangleF(0, 0, 36, 36), sf);
                    }
                }
                iconBox.Image = bmp;
                form.Controls.Add(iconBox);

                // Message Text Label
                Label lbl = new Label();
                lbl.Location = new Point(72, 20);
                lbl.Text = text;
                lbl.ForeColor = fg;
                lbl.TextAlign = ContentAlignment.TopLeft;
                lbl.Font = new Font("Segoe UI", 10f, FontStyle.Regular);

                int maxLabelWidth = 440;
                Size measured = TextRenderer.MeasureText(text, lbl.Font, new Size(maxLabelWidth, int.MaxValue), TextFormatFlags.WordBreak | TextFormatFlags.TextBoxControl);
                lbl.Size = new Size(Math.Max(300, Math.Min(maxLabelWidth, measured.Width + 10)), Math.Max(38, measured.Height + 10));
                form.Controls.Add(lbl);

                // Bottom Buttons Panel
                Panel pnl = new Panel();
                pnl.Dock = DockStyle.Bottom;
                pnl.Height = 52;
                pnl.BackColor = isDark ? Color.FromArgb(22, 22, 22) : Color.FromArgb(240, 240, 240);

                Func<string, DialogResult, bool, Button> makeBtn = (bText, dResult, isPrimary) =>
                {
                    Button b = new Button();
                    b.Text = bText;
                    b.DialogResult = dResult;
                    b.FlatStyle = FlatStyle.Flat;
                    b.FlatAppearance.BorderSize = 1;
                    b.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
                    b.Cursor = Cursors.Hand;

                    Size sz = TextRenderer.MeasureText(bText, b.Font);
                    int btnW = Math.Max(92, sz.Width + 28);
                    b.Size = new Size(btnW, 30);

                    if (isPrimary)
                    {
                        b.BackColor = primaryBg;
                        b.ForeColor = Color.White;
                        b.FlatAppearance.BorderColor = primaryBg;
                        b.FlatAppearance.MouseOverBackColor = primaryHover;
                    }
                    else
                    {
                        b.BackColor = btnBg;
                        b.ForeColor = fg;
                        b.FlatAppearance.BorderColor = btnBorder;
                        b.FlatAppearance.MouseOverBackColor = btnHover;
                    }
                    return b;
                };

                List<Button> buttonsList = new List<Button>();
                if (buttons == MessageBoxButtons.YesNo)
                {
                    Button btnYes = makeBtn(btn1Text ?? "Yes", DialogResult.Yes, true);
                    Button btnNo = makeBtn(btn2Text ?? "No", DialogResult.No, false);
                    buttonsList.Add(btnYes);
                    buttonsList.Add(btnNo);
                    form.AcceptButton = btnYes;
                    form.CancelButton = btnNo;
                }
                else if (buttons == MessageBoxButtons.YesNoCancel)
                {
                    Button btnYes = makeBtn(btn1Text ?? "Yes", DialogResult.Yes, true);
                    Button btnNo = makeBtn(btn2Text ?? "No", DialogResult.No, false);
                    Button btnCancel = makeBtn(btn3Text ?? "Cancel", DialogResult.Cancel, false);
                    buttonsList.Add(btnYes);
                    buttonsList.Add(btnNo);
                    buttonsList.Add(btnCancel);
                    form.AcceptButton = btnYes;
                    form.CancelButton = btnCancel;
                }
                else
                {
                    Button btnOk = makeBtn(btn1Text ?? "OK", DialogResult.OK, true);
                    buttonsList.Add(btnOk);
                    form.AcceptButton = btnOk;
                    form.CancelButton = btnOk;
                }

                int totalBtnWidth = 0;
                foreach (var b in buttonsList) totalBtnWidth += b.Width;
                totalBtnWidth += (buttonsList.Count - 1) * 10;

                int formWidth = Math.Max(460, Math.Max(lbl.Right + 32, totalBtnWidth + 48));
                int formHeight = Math.Max(165, lbl.Bottom + pnl.Height + 24);
                form.ClientSize = new Size(formWidth, formHeight);
                form.Controls.Add(pnl);

                int curRight = form.ClientSize.Width - 16;
                for (int i = buttonsList.Count - 1; i >= 0; i--)
                {
                    Button b = buttonsList[i];
                    b.Location = new Point(curRight - b.Width, 10);
                    b.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
                    pnl.Controls.Add(b);
                    curRight -= (b.Width + 10);
                }

                form.HandleCreated += (s, e) =>
                {
                    try
                    {
                        int darkFlag = isDark ? 1 : 0;
                        DwmSetWindowAttribute(form.Handle, 20, ref darkFlag, sizeof(int));
                        DwmSetWindowAttribute(form.Handle, 19, ref darkFlag, sizeof(int));
                        int capColor = isDark ? 0x001C1C1C : 0x00F3F3F3;
                        int bordColor = isDark ? 0x00383838 : 0x00D0D7DE;
                        int txtColor = isDark ? 0x00FFFFFF : 0x001F2328;
                        DwmSetWindowAttribute(form.Handle, 35, ref capColor, sizeof(int));
                        DwmSetWindowAttribute(form.Handle, 34, ref bordColor, sizeof(int));
                        DwmSetWindowAttribute(form.Handle, 36, ref txtColor, sizeof(int));
                    }
                    catch { }
                };

                return form.ShowDialog(owner);
            }
        }
    }
}
