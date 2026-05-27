# Security Policy

Glyph holds your clipboard history on disk. We take that seriously — please report security issues privately so we can fix them before they're publicly disclosed.

## Reporting a vulnerability

**Please do not file a public issue for security problems.** Instead, email:

> **oss@octane.team** — subject line starting with `[security]`.

Include in your report:

- A description of the issue and what an attacker could do with it.
- Reproduction steps or a proof-of-concept (commands, code, screenshots).
- The Glyph version (Settings shows it; otherwise the commit SHA you built from) and your OS.
- Any mitigations or workarounds you've already identified.

You should get a human acknowledgement within **7 days**. If you don't, please send a follow-up — sometimes email gets lost. We won't take action against anyone reporting in good faith.

## Disclosure timeline

We aim for the following, but treat each report on its merits:

| Severity                           | Target initial response | Target fix         |
| ---------------------------------- | ----------------------- | ------------------ |
| Critical — remote code, key theft  | 48 hours                | 7 days             |
| High — privilege escalation, leak  | 7 days                  | 30 days            |
| Medium / low                       | 7 days                  | next minor release |

After a fix ships, we'll publish an advisory crediting you (unless you'd rather stay anonymous) and document the issue in the changelog.

## Supported versions

Only the **latest minor release** receives security fixes. If you're on an older version, please update before reporting.

| Version       | Supported |
| ------------- | --------- |
| latest minor  | ✅        |
| anything else | ❌        |

## What's in scope

- The compiled Glyph application — Tauri shell, Rust backend, React frontend.
- The persisted store file (`glyphs-store.json`) and what's written to it.
- The IPC surface between renderer and Rust commands.
- The global shortcut, autostart, and clipboard-manager plugin integrations.

## What's not in scope

- Vulnerabilities in third-party dependencies that are already publicly tracked (file them upstream instead — but feel free to flag the version bump in a regular PR).
- Issues that require physical access to an unlocked machine.
- Bugs that require the user to manually edit the store file with malicious content.
- Anything in dev tooling (Vite dev server, etc.) that doesn't ship in release builds.

## Public disclosure

Once a fix is released, we'll publish a GitHub Security Advisory with the CVE (if assigned), affected versions, and credit to the reporter. Please give us a reasonable window between the patched release and your own writeup so users have time to update.
