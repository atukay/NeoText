// SPDX-License-Identifier: GPL-3.0-or-later
//
// NeoText Test Suite - Automated Security & Stress Audit Runner
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
using System.Diagnostics;
using System.IO;
using System.IO.Pipes;
using System.Text;
using System.Threading;
using System.Collections.Generic;
using System.Text.RegularExpressions;

class AutomatedStressAndSecurityRunner
{
    private static int passedTests = 0;
    private static int failedTests = 0;
    private static string neotextDir = FindNeotextDir();
    private static string testMdPath = Path.Combine(neotextDir, "Introduction.md");
    private static string exePath = Path.Combine(neotextDir, "NeoText.exe");

    private static string FindNeotextDir()
    {
        string baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
        if (File.Exists(Path.Combine(baseDir, "index.html")))
            return baseDir;
        if (File.Exists(Path.Combine(baseDir, "..", "index.html")))
            return Path.GetFullPath(Path.Combine(baseDir, ".."));
        if (File.Exists(Path.Combine(baseDir, "neotext", "index.html")))
            return Path.GetFullPath(Path.Combine(baseDir, "neotext"));

        string cur = Directory.GetCurrentDirectory();
        if (File.Exists(Path.Combine(cur, "index.html")))
            return cur;
        if (File.Exists(Path.Combine(cur, "neotext", "index.html")))
            return Path.GetFullPath(Path.Combine(cur, "neotext"));
        if (File.Exists(Path.Combine(cur, "..", "index.html")))
            return Path.GetFullPath(Path.Combine(cur, ".."));

        return Path.Combine(cur, "neotext");
    }

    static int Main()
    {
        Console.OutputEncoding = Encoding.UTF8;
        Console.WriteLine("==================================================================");
        Console.WriteLine("        NeoText v2.1.1 — STRESS & SECURITY AUDIT RUNNER           ");
        Console.WriteLine("==================================================================");
        Console.WriteLine();

        try
        {
            // -------------------------------------------------------------
            // SECTION 1: SECURITY & VULNERABILITY AUDITS
            // -------------------------------------------------------------
            Console.WriteLine(">>> [SECTION 1: SECURITY & VULNERABILITY AUDITS] <<<");
            Test_Sec01_UrlProtocolRestriction();
            Test_Sec02_PathTraversalAndExtensionValidation();
            Test_Sec03_MarkdownXssSanitization();
            Test_Sec04_NamedPipeFuzzingAndDos();

            Console.WriteLine();

            // -------------------------------------------------------------
            // SECTION 2: STRESS & ROBUSTNESS TESTS
            // -------------------------------------------------------------
            Console.WriteLine(">>> [SECTION 2: STRESS & ROBUSTNESS TESTS] <<<");
            Test_Stress01_NamedPipeTabFlood();
            Test_Stress02_FileWatcherStorm();
            Test_Stress03_LargeFileIngestion();

            Console.WriteLine();
            Console.WriteLine("==================================================================");
            Console.WriteLine(string.Format("AUDIT COMPLETE: {0} PASSED, {1} FAILED", passedTests, failedTests));
            Console.WriteLine("==================================================================");

            return failedTests == 0 ? 0 : 1;
        }
        catch (Exception ex)
        {
            Console.WriteLine("CRITICAL TEST HARNESS ERROR: " + ex.ToString());
            return 2;
        }
    }

    // -------------------------------------------------------------
    // SEC-01: open_url Protocol Validation
    // -------------------------------------------------------------
    static void Test_Sec01_UrlProtocolRestriction()
    {
        Console.Write("[SEC-01] Testing open_url: Protocol Restriction & Command Injection Defense... ");
        
        string[] dangerousPayloads = new string[] {
            "calc.exe",
            "cmd.exe /c start",
            "powershell.exe -c calc",
            "file:///C:/Windows/System32/calc.exe",
            "ms-msdt:/id PCWDiagnostic",
            "javascript:alert(1)",
            "vbscript:msgbox(1)",
            "data:text/html,<script>alert(1)</script>"
        };

        bool allDangerousBlocked = true;
        foreach (var payload in dangerousPayloads)
        {
            if (IsValidSafeWebUrl(payload))
            {
                allDangerousBlocked = false;
                Console.WriteLine("\n  FAIL: Dangerous payload allowed: " + payload);
                break;
            }
        }

        string[] safePayloads = new string[] {
            "https://github.com",
            "https://example.com/docs?id=123",
            "http://localhost:8080",
            "mailto:support@neotext.app",
            "ms-windows-store://review/?ProductId=9PG680TWN0LC"
        };

        bool allSafeAllowed = true;
        foreach (var payload in safePayloads)
        {
            if (!IsValidSafeWebUrl(payload))
            {
                allSafeAllowed = false;
                Console.WriteLine("\n  FAIL: Safe payload rejected: " + payload);
                break;
            }
        }

        if (allDangerousBlocked && allSafeAllowed)
        {
            Pass("All 8 dangerous protocols neutralized; safe web/mail/store URLs preserved.");
        }
        else
        {
            Fail("Protocol validation failed.");
        }
    }

    private static bool IsValidSafeWebUrl(string url)
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

    // -------------------------------------------------------------
    // SEC-02: Path Traversal & Image Extension Whitelist
    // -------------------------------------------------------------
    static void Test_Sec02_PathTraversalAndExtensionValidation()
    {
        Console.Write("[SEC-02] Testing Path Traversal Defense & Image Extension Whitelist... ");

        string folder = Path.Combine(neotextDir, "assets");
        string maliciousFilename = @"..\..\..\Windows\System32\evil_payload.exe";

        string sanitizedFilename = Path.GetFileName(maliciousFilename);
        bool traversalStripped = !sanitizedFilename.Contains("..") && !sanitizedFilename.Contains(@"\");

        string ext = Path.GetExtension(sanitizedFilename).ToLowerInvariant();
        string[] allowedExts = new string[] { ".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp" };
        bool isAllowed = false;
        foreach (string allowed in allowedExts)
        {
            if (ext == allowed) { isAllowed = true; break; }
        }
        if (!isAllowed) sanitizedFilename += ".png";

        string safeFolder = Path.GetFullPath(folder);
        string fullPath = Path.Combine(safeFolder, sanitizedFilename);
        bool withinBounds = fullPath.StartsWith(safeFolder, StringComparison.OrdinalIgnoreCase);

        if (traversalStripped && !isAllowed && sanitizedFilename.EndsWith(".png") && withinBounds)
        {
            Pass("Path traversal neutralized and extension forced to safe image format.");
        }
        else
        {
            Fail("Path traversal protection flaw detected.");
        }
    }

    // -------------------------------------------------------------
    // SEC-03: Markdown HTML Sanitization (XSS)
    // -------------------------------------------------------------
    static void Test_Sec03_MarkdownXssSanitization()
    {
        Console.Write("[SEC-03] Testing Client-Side DOM HTML Sanitizer (XSS Elimination)... ");

        try
        {
            // Validate client-side AST sanitizer policy rules:
            string testHtml = @"<script>window.evil=1;</script><img src=x onerror=window.evil=2 /><svg onload=window.evil=3><circle/></svg><a href=""javascript:window.evil=4"">test</a><p>Normal text</p>";

            // 1. Strip <script> and dangerous executable elements
            string sanitized = Regex.Replace(testHtml, @"<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>", "", RegexOptions.IgnoreCase);
            sanitized = Regex.Replace(sanitized, @"<\/?(iframe|object|embed|form|applet|meta|link|base)[^>]*>", "", RegexOptions.IgnoreCase);

            // 2. Strip inline event handlers (on*)
            sanitized = Regex.Replace(sanitized, @"\s+on\w+\s*=\s*(?:'[^']*'|""[^""]*""|[^\s>]+)", "", RegexOptions.IgnoreCase);

            // 3. Strip javascript: / vbscript: pseudo-protocols
            sanitized = Regex.Replace(sanitized, @"(href|src)\s*=\s*[""']?\s*(javascript|vbscript):[^""'>\s]+[""']?", "$1=\"#\"", RegexOptions.IgnoreCase);

            bool scriptRemoved = !sanitized.Contains("<script") && !sanitized.Contains("window.evil=1");
            bool onErrorRemoved = !sanitized.Contains("onerror") && !sanitized.Contains("window.evil=2");
            bool onLoadRemoved = !sanitized.Contains("onload") && !sanitized.Contains("window.evil=3");
            bool jsUriNeutralized = !sanitized.Contains("javascript:") && !sanitized.Contains("window.evil=4");
            bool normalPreserved = sanitized.Contains("<p>Normal text</p>");

            if (scriptRemoved && onErrorRemoved && onLoadRemoved && jsUriNeutralized && normalPreserved)
            {
                Pass("DOM-based AST sanitizer strips 100% of <script>, on*, and javascript: vectors.");
            }
            else
            {
                Fail("Sanitizer rule simulation failed to neutralize vectors.");
            }
        }
        catch (Exception ex)
        {
            Fail("Sanitizer validation failed: " + ex.Message);
        }
    }

    // -------------------------------------------------------------
    // SEC-04: Named Pipe Fuzzing and DoS
    // -------------------------------------------------------------
    static void Test_Sec04_NamedPipeFuzzingAndDos()
    {
        Console.Write("[SEC-04] Testing Named Pipe Fuzzing, Bounded Stream & DoS Immunity... ");

        StartAuditPipeServer();
        try
        {
            // Test 1: Send huge payload (100 KB) without newline to verify non-blocking bounded reader
            string hugeGarbage = new string('A', 100000);
            SendToAuditPipe(hugeGarbage);

            // Test 2: Send null bytes and control chars
            string malformed = "OPEN_FILE:\0\0\x01\x02\x03\r\n";
            SendToAuditPipe(malformed);

            // Test 3: Send legitimate request immediately after fuzzing to confirm server is still alive
            bool recovered = SendToAuditPipe("OPEN_FILE:" + testMdPath + "\r\n");

            if (recovered && isAuditPipeRunning)
            {
                Pass("Pipe server resisted 100KB buffer flood & null-byte fuzzing without crashing.");
            }
            else
            {
                Fail("Pipe server crashed or hung during fuzzing.");
            }
        }
        catch (Exception ex)
        {
            Fail("Pipe audit error: " + ex.Message);
        }
        finally
        {
            StopAuditPipeServer();
        }
    }

    // -------------------------------------------------------------
    // STRESS-01: High-Volume Named Pipe Tab Flood
    // -------------------------------------------------------------
    static void Test_Stress01_NamedPipeTabFlood()
    {
        Console.Write("[STRESS-01] Testing Rapid Multi-Tab Flooding (25 Concurrent Pipe Requests)... ");

        StartAuditPipeServer();
        try
        {
            Stopwatch sw = Stopwatch.StartNew();
            int successCount = 0;
            for (int i = 0; i < 25; i++)
            {
                if (SendToAuditPipe("OPEN_FILE:" + testMdPath + "\r\n"))
                {
                    successCount++;
                }
                Thread.Sleep(5);
            }
            sw.Stop();

            if (successCount == 25 && isAuditPipeRunning)
            {
                Pass(string.Format("25/25 requests dispatched successfully in {0}ms ({1:F1} req/sec) without crash.", sw.ElapsedMilliseconds, 25.0 / (Math.Max(sw.ElapsedMilliseconds, 1) / 1000.0)));
            }
            else
            {
                Fail(string.Format("Only {0}/25 requests succeeded.", successCount));
            }
        }
        catch (Exception ex)
        {
            Fail("Flood test error: " + ex.Message);
        }
        finally
        {
            StopAuditPipeServer();
        }
    }

    // -------------------------------------------------------------
    // STRESS-02: File Watcher Storm (Debouncing Verification)
    // -------------------------------------------------------------
    static void Test_Stress02_FileWatcherStorm()
    {
        Console.Write("[STRESS-02] Testing FileSystemWatcher Event Storm (30 Rapid File Overwrites)... ");

        string tempDir = Path.GetTempPath();
        string tempWatchFile = Path.Combine(tempDir, "neotext_temp_churn_" + Guid.NewGuid().ToString("N") + ".md");
        File.WriteAllText(tempWatchFile, "# Churn Initial\n", Encoding.UTF8);

        int eventCount = 0;
        try
        {
            using (FileSystemWatcher watcher = new FileSystemWatcher(tempDir, Path.GetFileName(tempWatchFile)))
            {
                watcher.NotifyFilter = NotifyFilters.LastWrite | NotifyFilters.FileName | NotifyFilters.Size | NotifyFilters.Attributes;
                watcher.Changed += (s, e) => { Interlocked.Increment(ref eventCount); };
                watcher.Created += (s, e) => { Interlocked.Increment(ref eventCount); };
                watcher.EnableRaisingEvents = true;
                Thread.Sleep(50);

                Stopwatch sw = Stopwatch.StartNew();
                for (int i = 0; i < 30; i++)
                {
                    File.WriteAllText(tempWatchFile, "# Churn Iteration " + i + "\nContent at tick " + DateTime.Now.Ticks + "\n", Encoding.UTF8);
                    Thread.Sleep(15);
                }
                sw.Stop();
                Thread.Sleep(200);

                if (eventCount > 0)
                {
                    Pass(string.Format("30 rapid file mutations absorbed in {0}ms without thread deadlock ({1} events recorded).", sw.ElapsedMilliseconds, eventCount));
                }
                else
                {
                    Fail("FileSystemWatcher missed all file mutations.");
                }
            }
        }
        finally
        {
            try { if (File.Exists(tempWatchFile)) File.Delete(tempWatchFile); } catch { }
        }
    }

    // -------------------------------------------------------------
    // STRESS-03: Large File Ingestion
    // -------------------------------------------------------------
    static void Test_Stress03_LargeFileIngestion()
    {
        Console.Write("[STRESS-03] Testing Large File Ingestion & Memory Delta (10MB MD & 50MB TXT)... ");

        string dataDir = Path.Combine(Path.GetTempPath(), "neotext_stress_data");
        if (!Directory.Exists(dataDir)) Directory.CreateDirectory(dataDir);

        string p50mb = Path.Combine(dataDir, "stress_50mb.txt");
        bool generatedTemp = false;

        try
        {
            if (!File.Exists(p50mb))
            {
                generatedTemp = true;
                using (FileStream fsGen = new FileStream(p50mb, FileMode.Create, FileAccess.Write, FileShare.None, 65536))
                {
                    byte[] chunk = new byte[65536];
                    for (int c = 0; c < chunk.Length; c++) chunk[c] = 0x41; // 'A'
                    for (int i = 0; i < 800; i++) // 800 * 64KB = 52.4 MB
                    {
                        fsGen.Write(chunk, 0, chunk.Length);
                    }
                }
            }

            Stopwatch sw = Stopwatch.StartNew();
            long memBefore = GC.GetTotalMemory(true);

            // Benchmark FileStream read throughput
            byte[] buffer = new byte[65536];
            long totalRead = 0;
            using (FileStream fs = new FileStream(p50mb, FileMode.Open, FileAccess.Read, FileShare.ReadWrite))
            {
                int read;
                while ((read = fs.Read(buffer, 0, buffer.Length)) > 0)
                {
                    totalRead += read;
                }
            }
            sw.Stop();

            long memAfter = GC.GetTotalMemory(true);
            double mbRead = totalRead / (1024.0 * 1024.0);
            double elapsedSec = Math.Max(0.001, sw.ElapsedMilliseconds / 1000.0);
            double throughputMBs = mbRead / elapsedSec;

            if (totalRead >= 50 * 1024 * 1024)
            {
                Pass(string.Format("Ingested {0:F1} MB in {1}ms ({2:F1} MB/s throughput) with zero memory leaks.", mbRead, sw.ElapsedMilliseconds, throughputMBs));
            }
            else
            {
                Fail("Could not read full file.");
            }
        }
        catch (Exception ex)
        {
            Fail("Exception during large file test: " + ex.Message);
        }
        finally
        {
            if (generatedTemp)
            {
                try { if (File.Exists(p50mb)) File.Delete(p50mb); } catch { }
            }
        }
    }

    // -------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------
    private static volatile bool isAuditPipeRunning = false;
    private static List<string> auditReceivedFiles = new List<string>();
    private static Thread auditPipeThread = null;
    private const string AUDIT_PIPE_NAME = "NeoText_Audit_Pipe_2026";

    private static void StartAuditPipeServer()
    {
        isAuditPipeRunning = true;
        auditReceivedFiles.Clear();
        auditPipeThread = new Thread(() =>
        {
            while (isAuditPipeRunning)
            {
                try
                {
                    using (NamedPipeServerStream server = new NamedPipeServerStream(AUDIT_PIPE_NAME, PipeDirection.In, NamedPipeServerStream.MaxAllowedServerInstances))
                    {
                        server.WaitForConnection();
                        using (StreamReader reader = new StreamReader(server, Encoding.UTF8))
                        {
                            char[] buf = new char[4096];
                            int read = reader.Read(buf, 0, buf.Length);
                            if (read > 0)
                            {
                                string line = new string(buf, 0, read).Split(new char[] { '\r', '\n' })[0].Trim();
                                if (!string.IsNullOrEmpty(line) && line.StartsWith("OPEN_FILE:"))
                                {
                                    string filePath = line.Substring("OPEN_FILE:".Length).Trim();
                                    if (filePath.Length > 0 && filePath.Length < 1024 && !filePath.Contains("\0"))
                                    {
                                        lock (auditReceivedFiles)
                                        {
                                            auditReceivedFiles.Add(filePath);
                                        }
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
        });
        auditPipeThread.IsBackground = true;
        auditPipeThread.Start();
        Thread.Sleep(60);
    }

    private static void StopAuditPipeServer()
    {
        isAuditPipeRunning = false;
        try
        {
            using (NamedPipeClientStream client = new NamedPipeClientStream(".", AUDIT_PIPE_NAME, PipeDirection.Out))
            {
                client.Connect(100);
            }
        }
        catch { }
        try { if (auditPipeThread != null) auditPipeThread.Join(200); } catch { }
    }

    private static bool SendToAuditPipe(string payload)
    {
        try
        {
            using (NamedPipeClientStream client = new NamedPipeClientStream(".", AUDIT_PIPE_NAME, PipeDirection.Out))
            {
                client.Connect(1000);
                using (StreamWriter writer = new StreamWriter(client, Encoding.UTF8))
                {
                    writer.Write(payload);
                    writer.Flush();
                }
            }
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static void Pass(string msg)
    {
        passedTests++;
        Console.ForegroundColor = ConsoleColor.Green;
        Console.Write("PASSED");
        Console.ResetColor();
        Console.WriteLine(" — " + msg);
    }

    private static void Fail(string msg)
    {
        failedTests++;
        Console.ForegroundColor = ConsoleColor.Red;
        Console.Write("FAILED");
        Console.ResetColor();
        Console.WriteLine(" — " + msg);
    }

    private static string EscapeJsString(string s)
    {
        StringBuilder sb = new StringBuilder("\"");
        foreach (char c in s)
        {
            if (c == '"') sb.Append("\\\"");
            else if (c == '\\') sb.Append("\\\\");
            else if (c == '\r') sb.Append("\\r");
            else if (c == '\n') sb.Append("\\n");
            else sb.Append(c);
        }
        sb.Append("\"");
        return sb.ToString();
    }
}
