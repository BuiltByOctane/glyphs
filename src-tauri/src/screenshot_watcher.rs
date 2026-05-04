#![cfg(target_os = "macos")]

use crate::clipboard_watcher::{base64_encode, commit_image};
use crate::store::{load_max_history_size, MAX_ITEM_BYTES};
use notify::event::{CreateKind, EventKind, ModifyKind, RenameMode};
use notify::{Event, RecursiveMode, Watcher};
use std::path::{Path, PathBuf};
use std::process::Command;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, RecvTimeoutError};
use std::sync::{Arc, Mutex, OnceLock};
use std::thread;
use std::time::{Duration, SystemTime};
use tauri::{AppHandle, Emitter};

static STATE: OnceLock<Mutex<Option<Arc<AtomicBool>>>> = OnceLock::new();

fn state() -> &'static Mutex<Option<Arc<AtomicBool>>> {
    STATE.get_or_init(|| Mutex::new(None))
}

pub fn start_screenshot_watcher(app: AppHandle) {
    let mut guard = match state().lock() {
        Ok(g) => g,
        Err(_) => return,
    };
    if guard.is_some() {
        return;
    }
    let stop = Arc::new(AtomicBool::new(false));
    *guard = Some(stop.clone());
    drop(guard);

    let app_for_thread = app.clone();
    thread::spawn(move || {
        let mut backoff = Duration::from_secs(1);
        let max_backoff = Duration::from_secs(60);
        while !stop.load(Ordering::Acquire) {
            match run_watcher(&app_for_thread, &stop) {
                RunResult::Stopped => break,
                RunResult::DirMissing => {
                    log::warn!("screenshot directory unavailable; watcher idle");
                    break;
                }
                RunResult::Failed(e) => {
                    log::error!("screenshot watcher failed: {}; restarting", e);
                    let _ = app_for_thread.emit("watcher-error", e);
                    thread::sleep(backoff);
                    backoff = (backoff * 2).min(max_backoff);
                }
            }
        }
        if let Ok(mut g) = state().lock() {
            *g = None;
        }
    });
}

pub fn set_enabled(app: &AppHandle, enabled: bool) {
    if enabled {
        start_screenshot_watcher(app.clone());
    } else if let Ok(mut guard) = state().lock() {
        if let Some(stop) = guard.take() {
            stop.store(true, Ordering::Release);
        }
    }
}

enum RunResult {
    Stopped,
    DirMissing,
    Failed(String),
}

fn run_watcher(app: &AppHandle, stop: &Arc<AtomicBool>) -> RunResult {
    let dir = screenshot_dir();
    if !dir.is_dir() {
        log::warn!("screenshot dir not found: {}", dir.display());
        return RunResult::DirMissing;
    }

    let start_time = SystemTime::now();
    let (tx, rx) = mpsc::channel();
    let mut watcher = match notify::recommended_watcher(move |res| {
        let _ = tx.send(res);
    }) {
        Ok(w) => w,
        Err(e) => return RunResult::Failed(format!("init: {}", e)),
    };
    if let Err(e) = watcher.watch(&dir, RecursiveMode::NonRecursive) {
        return RunResult::Failed(format!("watch {}: {}", dir.display(), e));
    }

    log::info!("watching screenshots in {}", dir.display());
    while !stop.load(Ordering::Acquire) {
        match rx.recv_timeout(Duration::from_millis(500)) {
            Ok(Ok(event)) => handle_event(app, &event, start_time),
            Ok(Err(e)) => log::warn!("screenshot watcher event err: {}", e),
            Err(RecvTimeoutError::Timeout) => continue,
            Err(RecvTimeoutError::Disconnected) => {
                return RunResult::Failed("event channel disconnected".into())
            }
        }
    }
    RunResult::Stopped
}

fn handle_event(app: &AppHandle, ev: &Event, start_time: SystemTime) {
    let interesting = matches!(
        ev.kind,
        EventKind::Create(CreateKind::File)
            | EventKind::Modify(ModifyKind::Name(RenameMode::To))
            | EventKind::Modify(ModifyKind::Name(RenameMode::Any))
    );
    if !interesting {
        return;
    }
    for path in &ev.paths {
        if !is_png(path) {
            continue;
        }
        let app = app.clone();
        let path = path.clone();
        thread::spawn(move || import_when_stable(app, path, start_time));
    }
}

fn is_png(path: &Path) -> bool {
    path.extension()
        .and_then(|s| s.to_str())
        .map(|s| s.eq_ignore_ascii_case("png"))
        .unwrap_or(false)
}

fn import_when_stable(app: AppHandle, path: PathBuf, start_time: SystemTime) {
    let mut last_size: u64 = 0;
    let mut stable_size: Option<u64> = None;
    for _ in 0..6 {
        thread::sleep(Duration::from_millis(250));
        let meta = match std::fs::metadata(&path) {
            Ok(m) => m,
            Err(_) => return,
        };
        if let Ok(created) = meta.created() {
            // Skip files that already existed before the watcher started so we
            // don't flood history with the user's pre-existing screenshots.
            if created < start_time {
                return;
            }
        }
        let size = meta.len();
        if size > 0 && size == last_size {
            stable_size = Some(size);
            break;
        }
        last_size = size;
    }
    let size = match stable_size {
        Some(s) => s,
        None => {
            log::info!(
                "screenshot {} did not stabilize, skipping",
                path.display()
            );
            return;
        }
    };
    if (size as usize) > MAX_ITEM_BYTES {
        log::info!(
            "skipping screenshot {} ({} bytes > cap)",
            path.display(),
            size
        );
        return;
    }
    let bytes = match std::fs::read(&path) {
        Ok(b) => b,
        Err(e) => {
            log::warn!("read screenshot {}: {}", path.display(), e);
            return;
        }
    };
    if !bytes.starts_with(&[0x89, b'P', b'N', b'G']) {
        return;
    }
    let data_url = format!("data:image/png;base64,{}", base64_encode(&bytes));
    if data_url.len() > MAX_ITEM_BYTES {
        return;
    }
    let max_size = load_max_history_size(&app);
    if let Err(e) = commit_image(&app, data_url, max_size) {
        log::warn!("commit screenshot: {}", e);
    }
}

// One-shot read of the user's screenshot folder preference. Changes to this
// preference at runtime require toggling the setting off/on to pick up.
fn screenshot_dir() -> PathBuf {
    let raw = Command::new("defaults")
        .args(["read", "com.apple.screencapture", "location"])
        .output()
        .ok()
        .and_then(|o| {
            if o.status.success() {
                String::from_utf8(o.stdout).ok()
            } else {
                None
            }
        })
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty());

    let path = raw.unwrap_or_else(|| "~/Desktop".to_string());
    expand_tilde(&path)
}

fn expand_tilde(p: &str) -> PathBuf {
    if let Some(rest) = p.strip_prefix("~/") {
        if let Some(home) = std::env::var_os("HOME") {
            return PathBuf::from(home).join(rest);
        }
    }
    if p == "~" {
        if let Some(home) = std::env::var_os("HOME") {
            return PathBuf::from(home);
        }
    }
    PathBuf::from(p)
}
