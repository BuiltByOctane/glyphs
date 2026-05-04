# Contributing to Glyph

Thanks for taking the time to contribute. This document covers the practical bits — setting up your dev environment, the conventions we follow, and what's expected before you open a pull request.

By participating in this project you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). For security issues, please follow the disclosure process in [SECURITY.md](SECURITY.md) instead of opening a public issue.

---

## Filing issues

Use the [issue templates](.github/ISSUE_TEMPLATE/). Bug reports need a clear repro path and your OS + Glyph version. Feature requests should explain the underlying problem first, then propose a solution.

If you're not sure whether something is a bug or expected behavior, file it as a bug report and we'll triage.

## Local development

### Prerequisites

- **Node.js** 20 or newer
- **Rust** 1.77.2 or newer (matches `src-tauri/Cargo.toml`)
- Tauri 2 platform prerequisites: <https://v2.tauri.app/start/prerequisites/>

On macOS this means Xcode Command Line Tools. On Linux it means a handful of system libraries (webkit2gtk, libgtk, etc.). Follow the Tauri docs for your distro.

### First-run setup

```sh
git clone https://github.com/USERNAME/glyph.git
cd glyph
npm install
npm run tauri:dev
```

That last command compiles the Rust shell, starts the Vite dev server, and opens the app with hot-reloading for the React side. Rust changes trigger a rebuild and restart.

### Common commands

| Goal                              | Command                       |
| --------------------------------- | ----------------------------- |
| Run dev build (HMR + Rust watch)  | `npm run tauri:dev`           |
| Build release artifact            | `npm run tauri:build`         |
| Type-check the frontend           | `npx tsc --noEmit`            |
| Lint the frontend                 | `npm run lint`                |
| Compile the Rust backend          | `cd src-tauri && cargo check` |
| Lint the Rust backend             | `cd src-tauri && cargo clippy --all-targets` |

## Project layout

See the **Project structure** section in [README.md](README.md). High level:

- **Frontend** lives under `src/`. State goes through Zustand (`src/store/use-clipboard-store.ts`) which talks to Tauri commands via `invoke`.
- **Backend** lives under `src-tauri/src/`. `commands.rs` exposes the IPC surface; `store.rs` owns the persisted shape; `clipboard_watcher.rs` runs the OS-level watcher thread.
- **Capabilities** (`src-tauri/capabilities/default.json`) gate which Tauri APIs the renderer is allowed to call. Add to this file if you introduce a new plugin permission.

## Code style

- **TypeScript / React** — flat ESLint config in `.eslintrc.cjs`. Run `npm run lint` and resolve all warnings before pushing. Prefer simple components; we don't reach for state management beyond Zustand.
- **Rust** — pass `cargo clippy --all-targets` cleanly. Keep functions small and return `Result<_, String>` from commands so the frontend gets a useful error message via `invoke()`.
- **Comments** — only when the *why* is non-obvious (a hidden invariant, a race, a workaround). If a clear identifier explains *what*, don't add a comment.
- **Don't add abstractions a single caller wouldn't need.** Three similar lines beat a premature helper.

## UI conventions

- All theme-aware colors should use `text-foreground`, `bg-background`, `bg-foreground/X`, etc. Avoid hardcoded `text-white` / `bg-white` so light mode works correctly.
- Modal dialogs add `no-drag` to their root so clicks don't try to drag the window.
- Interactive elements inside drag regions need `no-drag`.

## Commit messages

Short imperative subject lines, body if context helps. Examples:

```
fix: paste-back preserves pin and group metadata
feat(settings): add show/hide footer toggle
chore: bump tauri-plugin-autostart to 2.5
```

One PR = one logical change. If you're tempted to bundle "and also fixed X" into a feature PR, split it.

## Pull request checklist

Before opening a PR, please run:

- [ ] `npx tsc --noEmit` — type-check passes
- [ ] `npm run lint` — eslint clean
- [ ] `cd src-tauri && cargo check` — Rust compiles
- [ ] `cd src-tauri && cargo clippy --all-targets` — no new warnings
- [ ] Manual smoke: clipboard captures still work, paste-back preserves pin/group, settings persist across a restart

For UI changes, please include a screenshot or short screen recording in the PR description.

## Areas that welcome contribution

- **More clipboard formats** — currently text and image only; rich-text/HTML and file paths are on the roadmap.
- **Accessibility** — proper ARIA on the list rows, settings controls, and modals.
- **Additional themes** — high-contrast variants, follow-system-accent.
- **Localization** — strings are currently inline in JSX; an i18n layer would unlock translations.
- **Windows/Linux polish** — most testing has happened on macOS; bug reports and fixes for the other platforms are especially welcome.

## Questions?

Open a [discussion](https://github.com/USERNAME/glyph/discussions) (once the repo enables them) or file an issue tagged `question`.
