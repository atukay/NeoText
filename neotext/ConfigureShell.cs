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
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Threading;
using Microsoft.Win32;

namespace NeoText
{
    class ConfigureShell
    {
        [DllImport("shell32.dll", CharSet = CharSet.Auto, SetLastError = true)]
        private static extern void SHChangeNotify(uint wEventId, uint uFlags, IntPtr dwItem1, IntPtr dwItem2);

        private const uint SHCNE_ASSOCCHANGED = 0x08000000;
        private const uint SHCNF_IDLIST = 0x0000;

        static void Main(string[] args)
        {
            string appDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd('\\');
            string exePath = Path.Combine(appDir, "NeoText.exe");
            string openCommand = "\"" + exePath + "\" \"%1\"";
            string menuText = "NeoText ile Aç";

            // Local AppData permanent physical icon cache (Guarantees instant availability at early OS boot before cloud mounts)
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string localAssetsDir = Path.Combine(localAppData, "NeoText", "assets");
            try
            {
                if (!Directory.Exists(localAssetsDir))
                {
                    Directory.CreateDirectory(localAssetsDir);
                }
            }
            catch { }

            string srcAppIco = File.Exists(Path.Combine(appDir, @"assets\app.ico")) 
                ? Path.Combine(appDir, @"assets\app.ico") 
                : Path.Combine(appDir, @"assets\neotext_app.ico");
            string srcDocIco = srcAppIco;
            string srcTxtIco = srcAppIco;
            string srcGenericIco = srcAppIco;

            string localAppIco = Path.Combine(localAssetsDir, "app.ico");
            string localDocIco = Path.Combine(localAssetsDir, "doc.ico");
            string localTxtIco = Path.Combine(localAssetsDir, "txt.ico");
            string localGenericIco = Path.Combine(localAssetsDir, "generic_doc.ico");

            try
            {
                if (File.Exists(srcAppIco))
                {
                    File.Copy(srcAppIco, localAppIco, true);
                    File.Copy(srcAppIco, localDocIco, true);
                    File.Copy(srcAppIco, localTxtIco, true);
                    File.Copy(srcAppIco, localGenericIco, true);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Notice mirroring icons to LocalAppData: " + ex.Message);
            }

            // Quoted icon paths for Registry DefaultIcon standard
            string quotedAppIco = "\"" + (File.Exists(localAppIco) ? localAppIco : srcAppIco) + "\"";
            string quotedDocIco = "\"" + (File.Exists(localDocIco) ? localDocIco : srcDocIco) + "\"";
            string quotedTxtIco = "\"" + (File.Exists(localTxtIco) ? localTxtIco : srcTxtIco) + "\"";
            string quotedGenericIco = "\"" + (File.Exists(localGenericIco) ? localGenericIco : srcGenericIco) + "\"";
            string contextMenuAppIcon = File.Exists(localAppIco) ? localAppIco : srcAppIco;

            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.WriteLine("Registering NeoText Windows Shell Associations (MD, Markdown, TXT, Generic)...");

            // Clean up legacy NeoMD registry entries
            CleanLegacyNeoMDKeys();

            // 1. Right-click on any file
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\*\shell\NeoText"))
            {
                if (key != null)
                {
                    key.SetValue("", menuText);
                    key.SetValue("Icon", contextMenuAppIcon);
                    using (RegistryKey cmdKey = key.CreateSubKey("command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 2. Right-click on .md files
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.md\shell\NeoText"))
            {
                if (key != null)
                {
                    key.SetValue("", menuText);
                    key.SetValue("Icon", contextMenuAppIcon);
                    using (RegistryKey cmdKey = key.CreateSubKey("command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 3. Document Icon for .md files
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.md\DefaultIcon"))
            {
                if (key != null) key.SetValue("", quotedDocIco);
            }

            // 4. Right-click on .markdown files
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.markdown\shell\NeoText"))
            {
                if (key != null)
                {
                    key.SetValue("", menuText);
                    key.SetValue("Icon", contextMenuAppIcon);
                    using (RegistryKey cmdKey = key.CreateSubKey("command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 5. Document Icon for .markdown files
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.markdown\DefaultIcon"))
            {
                if (key != null) key.SetValue("", quotedDocIco);
            }

            // 6. Right-click and DefaultIcon on .txt files
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.txt\shell\NeoText"))
            {
                if (key != null)
                {
                    key.SetValue("", menuText);
                    key.SetValue("Icon", contextMenuAppIcon);
                    using (RegistryKey cmdKey = key.CreateSubKey("command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\SystemFileAssociations\.txt\DefaultIcon"))
            {
                if (key != null) key.SetValue("", quotedTxtIco);
            }

            // 7. HKCU\Software\Classes\.md mapping
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.md"))
            {
                if (key != null)
                {
                    key.SetValue("", "NeoText.Document");
                    key.SetValue("Content Type", "text/markdown");
                    key.SetValue("PerceivedType", "document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedDocIco);
                    }
                    using (RegistryKey progidsKey = key.CreateSubKey("OpenWithProgids"))
                    {
                        if (progidsKey != null) progidsKey.SetValue("NeoText.Document", new byte[0], RegistryValueKind.None);
                    }
                }
            }

            // 8. HKCU\Software\Classes\.markdown mapping
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.markdown"))
            {
                if (key != null)
                {
                    key.SetValue("", "NeoText.Document");
                    key.SetValue("Content Type", "text/markdown");
                    key.SetValue("PerceivedType", "document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedDocIco);
                    }
                    using (RegistryKey progidsKey = key.CreateSubKey("OpenWithProgids"))
                    {
                        if (progidsKey != null) progidsKey.SetValue("NeoText.Document", new byte[0], RegistryValueKind.None);
                    }
                }
            }

            // 9. HKCU\Software\Classes\.txt mapping
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\.txt"))
            {
                if (key != null)
                {
                    key.SetValue("", "NeoText.TextDocument");
                    key.SetValue("Content Type", "text/plain");
                    key.SetValue("PerceivedType", "document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedTxtIco);
                    }
                    using (RegistryKey progidsKey = key.CreateSubKey("OpenWithProgids"))
                    {
                        if (progidsKey != null) progidsKey.SetValue("NeoText.TextDocument", new byte[0], RegistryValueKind.None);
                    }
                }
            }

            // 9b. HKCU\Software\Classes\txtfile DefaultIcon mapping
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\txtfile\DefaultIcon"))
            {
                if (key != null) key.SetValue("", quotedTxtIco);
            }

            // 10. HKCU\Software\Classes\Applications\NeoText.exe
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\Applications\NeoText.exe"))
            {
                if (key != null)
                {
                    key.SetValue("", "NeoText");
                    key.SetValue("FriendlyAppName", "NeoText");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedAppIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                    using (RegistryKey supKey = key.CreateSubKey("SupportedTypes"))
                    {
                        if (supKey != null)
                        {
                            string[] exts = new string[] {
                                ".md", ".markdown", ".mdown", ".mkd", ".mkdn",
                                ".txt", ".text", ".log", ".bat", ".cmd",
                                ".json", ".xml", ".ini", ".cfg", ".conf",
                                ".yaml", ".yml", ".toml", ".csv", ".tsv",
                                ".sql", ".py", ".js", ".ts", ".cs", ".sh",
                                ".env", ".properties"
                            };
                            foreach (string ext in exts)
                            {
                                supKey.SetValue(ext, "");
                            }
                        }
                    }
                }
            }

            // 11. HKCU App Paths
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\App Paths\NeoText.exe"))
            {
                if (key != null)
                {
                    key.SetValue("", exePath);
                    key.SetValue("Path", appDir);
                }
            }

            // 12. MuiCache Friendly Names
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\MuiCache"))
            {
                if (key != null)
                {
                    key.SetValue(exePath + ".FriendlyAppName", "NeoText");
                    key.SetValue(exePath + ".ApplicationCompany", "NeoText");
                }
            }

            // 13. ProgID: NeoText.Document (Markdown)
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\NeoText.Document"))
            {
                if (key != null)
                {
                    key.SetValue("", "Markdown Belgesi");
                    key.SetValue("FriendlyTypeName", "NeoText Markdown Document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedDocIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 13b. ProgID: NeoText.TextDocument (Plain Text)
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\NeoText.TextDocument"))
            {
                if (key != null)
                {
                    key.SetValue("", "Metin Belgesi");
                    key.SetValue("FriendlyTypeName", "NeoText Text Document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedTxtIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 13c. ProgID: NeoText.GenericDocument (Logs, Batch, Configs, etc.)
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\NeoText.GenericDocument"))
            {
                if (key != null)
                {
                    key.SetValue("", "NeoText Belgesi");
                    key.SetValue("FriendlyTypeName", "NeoText Generic Document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedGenericIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 13d. Compatibility Bridge: NeoMD.Document (Points legacy references to NeoText & doc.ico)
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\NeoMD.Document"))
            {
                if (key != null)
                {
                    key.SetValue("", "Markdown Belgesi (NeoText)");
                    key.SetValue("FriendlyTypeName", "NeoText Markdown Document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedDocIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 13e. Compatibility Bridge: NeoMD.TextDocument (Points legacy references to NeoText & txt.ico)
            using (RegistryKey key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\NeoMD.TextDocument"))
            {
                if (key != null)
                {
                    key.SetValue("", "Metin Belgesi (NeoText)");
                    key.SetValue("FriendlyTypeName", "NeoText Text Document");
                    using (RegistryKey iconKey = key.CreateSubKey("DefaultIcon"))
                    {
                        if (iconKey != null) iconKey.SetValue("", quotedTxtIco);
                    }
                    using (RegistryKey cmdKey = key.CreateSubKey(@"shell\open\command"))
                    {
                        if (cmdKey != null) cmdKey.SetValue("", openCommand);
                    }
                }
            }

            // 14. Purge Explorer Icon Cache if requested
            bool purge = (args.Length > 0 && args[0].ToLower().Contains("cache")) || true;
            if (purge)
            {
                PurgeExplorerIconCache();
            }

            // 15. Broadcast Shell Association and Icon Changes
            SHChangeNotify(SHCNE_ASSOCCHANGED, SHCNF_IDLIST, IntPtr.Zero, IntPtr.Zero);
            Console.WriteLine("Shell registration successfully completed for NeoText.");
        }

        private static void CleanLegacyNeoMDKeys()
        {
            try
            {
                Console.WriteLine("Cleaning legacy NeoMD shell keys...");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Classes\*\shell\NeoMD");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Classes\SystemFileAssociations\.md\shell\NeoMD");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Classes\SystemFileAssociations\.markdown\shell\NeoMD");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Classes\SystemFileAssociations\.txt\shell\NeoMD");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Classes\Applications\NeoMD.exe");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Microsoft\Windows\CurrentVersion\App Paths\NeoMD.exe");
                DeleteSubKeyTreeSafe(Registry.CurrentUser, @"Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\.md\UserChoiceLatest");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Notice cleaning legacy keys: " + ex.Message);
            }
        }

        private static void DeleteSubKeyTreeSafe(RegistryKey root, string subKey)
        {
            try
            {
                root.DeleteSubKeyTree(subKey, false);
            }
            catch { }
        }

        private static void PurgeExplorerIconCache()
        {
            try
            {
                Console.WriteLine("Purging Explorer Icon Cache to refresh desktop icons...");

                Process[] procs = Process.GetProcessesByName("explorer");
                foreach (var p in procs)
                {
                    try { p.Kill(); p.WaitForExit(1500); } catch { }
                }

                Thread.Sleep(400);

                string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string iconCache = Path.Combine(localAppData, "IconCache.db");
                if (File.Exists(iconCache))
                {
                    try { File.Delete(iconCache); } catch { }
                }

                string explorerCacheDir = Path.Combine(localAppData, @"Microsoft\Windows\Explorer");
                if (Directory.Exists(explorerCacheDir))
                {
                    string[] iconDbs = Directory.GetFiles(explorerCacheDir, "iconcache_*.db");
                    foreach (string f in iconDbs)
                    {
                        try { File.Delete(f); } catch { }
                    }
                }

                // Restart explorer cleanly
                Process.Start("explorer.exe");
                Console.WriteLine("Explorer restarted cleanly.");
            }
            catch (Exception ex)
            {
                Console.WriteLine("Notice: Explorer restart: " + ex.Message);
            }
        }
    }
}
