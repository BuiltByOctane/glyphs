<div align="center">
  <img src="public/icon.png" alt="Glyph" width="120" />

  <h1>Glyph</h1>

  <p><strong>A fast, keyboard-first clipboard manager for macOS, Windows, and Linux.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey" alt="Platforms" />
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
    <img src="https://img.shields.io/badge/built%20with-Tauri%202-24c8db" alt="Tauri" />
  </p>
</div>

---

## Features

- **Persistent clipboard history** — text and images, kept across restarts.
- **Pin items** so they never get auto-pruned, regardless of history limits.
- **Groups with custom icons** — file your snippets, links, and code blocks into named categories from a 35-icon library.
- **Fuzzy search** across the entire history.
- **Quick paste** — `⌘1`–`⌘9` to paste any of the top nine items without leaving your keyboard.
- **QR code** for any text item — scan it from your phone instead of e-mailing it to yourself.
- **Customizable global shortcut** to toggle the window from anywhere.
- **System tray** support; runs as an accessory app on macOS (no dock icon).
- **Light / dark / system** theme.
- **Auto-start on login**, **always-on-top**, and **hide-on-blur** are all togglable.
- **Cross-platform** — macOS, Windows, and Linux from a single Rust + React codebase.

## Screenshots

> Place your captures in `public/` and link them here. Suggested set: main list, group filter, settings, QR modal.

## Installation

Pre-built artifacts are published on the [Releases page](https://github.com/devoctane/glyphs/releases).

> **Platform status:** Only the macOS build is currently released and tested. Windows (`.exe`/`.msi`) and Linux (`.AppImage`/`.deb`) binaries are **not** shipped yet, and the app has not been tested on those platforms — expect OS-specific bugs (synthetic paste, global shortcuts, tray behavior, autostart) if you build from source. Contributions to get Windows and Linux to parity are very welcome — see [Contributing](#contributing).

### macOS

1. Download `Glyphs_x.y.z_universal.dmg` — one universal build that runs on both Apple Silicon and Intel Macs.
2. Open the `.dmg` and drag **Glyphs** to your Applications folder.
3. The build is currently unsigned, so on first launch macOS will say *"Glyphs can't be opened"* or *"is damaged"*. Either right-click the app and choose **Open**, or run `xattr -cr /Applications/Glyphs.app` once in Terminal to clear the quarantine flag.
4. Launch it. The first run will ask for *Accessibility* permission so it can simulate `⌘V` when you click an item — grant it under **System Settings → Privacy & Security → Accessibility**.
5. Press the global shortcut (`⌘B` by default) to toggle the window.

### Windows & Linux

No pre-built artifacts are published yet. You can build from source (see [Build from source](#build-from-source)), but the app is **untested** on these platforms and OS-specific issues are expected. Help wanted — see [Contributing](#contributing).

## Build from source

Glyph uses Tauri 2. Install the Tauri prerequisites for your OS first: <https://v2.tauri.app/start/prerequisites/>.

```sh
git clone https://github.com/devoctane/glyphs.git
cd glyph
pnpm install

# Development (hot-reloading dev build)
pnpm tauri:dev

# Release artifact for your current OS
pnpm tauri:build
```

The built binary lands in `src-tauri/target/release/bundle/`.

### macOS universal build (Apple Silicon + Intel)

To produce a single `.dmg` that runs on both Apple Silicon and Intel Macs, install both Rust targets first, then build with the `universal-apple-darwin` target:

```sh
rustup target add aarch64-apple-darwin x86_64-apple-darwin
pnpm tauri:build --target universal-apple-darwin
```

The artifact lands at `src-tauri/target/universal-apple-darwin/release/bundle/dmg/Glyphs_x.y.z_universal.dmg`. The fat binary is roughly twice the size of an arch-specific build but ships as one download.

### Required toolchains

- **Node.js** 20 or newer
- **pnpm** 10 or newer — the package manager this project uses (`npm install -g pnpm`, or run `corepack enable` to pick up the version pinned in `package.json`)
- **Rust** 1.77.2 or newer (the version pinned in `src-tauri/Cargo.toml`)
- Platform deps documented at the Tauri prerequisites link above.

## Usage

Open Glyph with the global shortcut (default `⌘B` on macOS, `Ctrl+B` on Windows/Linux). Navigate with the keyboard:

| Action                      | Shortcut                |
| --------------------------- | ----------------------- |
| Focus search                | `⌘ K`                   |
| Move selection              | `↑` / `↓` or `J` / `K`  |
| Switch group                | `H` / `L`               |
| Paste selected              | `Enter`                 |
| Paste as plain text         | `Shift + Enter`         |
| Quick-paste item N          | `⌘ 1`–`⌘ 9`             |
| Pin / unpin selected        | `P`                     |
| Delete selected             | `⌘ D`                   |
| Create new group            | `⌘ G`                   |
| Open settings               | `⌘ ,`                   |
| Show shortcuts dialog       | `?`                     |
| Hide window / clear search  | `Esc` or `⌘ [`          |

The full list also lives in-app at the `?` shortcut.

## Configuration

Open **Settings** with `⌘,` (or the gear icon in the footer). Available controls:

- **Launch on login** — start Glyph automatically when you sign in.
- **Max history items** — soft cap on unpinned items (10–500). Pinned items are never auto-trimmed.
- **Toggle Glyph shortcut** — record a new global shortcut. Conflicts with other apps are detected before persisting.
- **Theme** — System / Light / Dark.
- **Always on top** — keep Glyph above other windows when shown.
- **Hide when window loses focus** — auto-close as soon as another app takes focus.
- **Show footer** — hide the bottom hint bar to reclaim screen space.
- **Reset** — wipe history, groups, and settings.

Settings are persisted via `tauri-plugin-store` and survive restarts.

## Tech stack

- **Frontend** — React 18, Zustand, Tailwind CSS v4, Lucide icons.
- **Shell** — Tauri 2.
- **Backend** — Rust, with `arboard` (clipboard read/write), `clipboard-master` (cross-platform watcher), `tauri-plugin-store` (persistence), `tauri-plugin-global-shortcut` (system-wide hotkey), `tauri-plugin-autostart` (login items), and `enigo` / `osascript` / `xdotool` for synthetic paste keystrokes.

## Project structure

```
glyph/
├── public/                    static assets (icon, screenshots)
├── src/                       React app
│   ├── App.tsx
│   ├── components/            shared UI primitives (Kbd, …)
│   ├── features/
│   │   ├── clipboard/         list, item row, modals, shortcut hook
│   │   └── settings/          settings page, recorder, toggles
│   └── store/                 Zustand store (talks to Tauri commands)
├── src-tauri/                 Rust backend
│   ├── src/
│   │   ├── lib.rs             plugin wiring, tray, window toggle
│   │   ├── commands.rs        all #[tauri::command] entry points
│   │   ├── clipboard_watcher.rs
│   │   └── store.rs           data shape + persisted helpers
│   ├── capabilities/          Tauri permission scopes
│   └── tauri.conf.json
└── ...
```

## Contributing

Issues and PRs are welcome. Please read **[CONTRIBUTING.md](CONTRIBUTING.md)** before opening a PR — it covers local setup, expected code style, and the pre-submission checklist. By participating you agree to abide by the [Code of Conduct](CODE_OF_CONDUCT.md). Security issues should follow the disclosure process in [SECURITY.md](SECURITY.md).

Looking for somewhere to start? Search the [issues](https://github.com/devoctane/glyphs/issues) for the `good first issue` label, or pick one of the open areas listed in `CONTRIBUTING.md`.

### A note on AI / agentic contributions

You're free to use AI assistants and agentic coding tools (Claude Code, Cursor, Copilot, etc.) on this codebase — there are no restrictions. **But with great power comes great responsibility:** understand what you're pushing and *why*, not just *what*. Skim the diff, run it locally, and be able to defend the change in review.

For full transparency: the entire Rust/Tauri shell was migrated from an earlier Electron prototype with heavy AI assistance, back when I wasn't a Rust guy. I can now explain how the code works and why it's written that way — but it took going back and reading every line after the fact. Please don't skip that step.

## License

[MIT](LICENSE) © Glyph Contributors.
