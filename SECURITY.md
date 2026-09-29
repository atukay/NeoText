# Security Policy for NeoText

The NeoText Project takes software security, memory safety, and user data privacy with utmost engineering seriousness.

---

## Security Architecture Overview

NeoText operates as a native desktop application embedding modern web technologies. To prevent local privilege escalation, malicious file execution, and cross-site scripting (XSS), the following defenses are permanently active:

1. **Protocol Sanitization (`IsValidSafeWebUrl`):**  
   External web navigation is strictly restricted to `http`, `https`, and `mailto`. Arbitrary protocol execution (`file://`, `javascript:`, `powershell:`) is hard-blocked.
2. **AST-Level DOM Sanitizer (`sanitizeRenderedHtml`):**  
   Markdown parsing explicitly strips all `<script>`, `<iframe>`, inline `on*` DOM event listeners, and dangerous URI schemes.
3. **Bounded IPC Tamper Protection:**  
   Single-instance Named Pipe listeners enforce a strict 4096-character buffer and automatically terminate on null-byte fuzzing attempts.
4. **Path Traversal Guard:**  
   Clipboard image saves enforce `Path.GetFileName` normalization and strict extension validation (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.bmp`).
5. **Memory & Resource Caps:**  
   Directory crawling is strictly limited to 600 nodes / 5 levels of depth, and documents larger than 2 MB automatically engage low-overhead pre-formatted rendering.

---

## Reporting a Vulnerability

If you discover a security vulnerability or exploit vector in NeoText:

1. Please do not open a public issue.
2. Report the vulnerability privately via GitHub Private Vulnerability Reporting on the official repository:  
   https://github.com/atukay/NeoText/security/advisories
3. Provide a clear description of the issue, reproduction steps, and a proof-of-concept Markdown document if possible.

All valid security reports will be investigated, resolved, and acknowledged in the release notes.
