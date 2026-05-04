use crate::store::*;
use arboard::Clipboard;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_autostart::ManagerExt as AutostartManagerExt;
use tauri_plugin_global_shortcut::GlobalShortcutExt;

const GROUP_NAME_MIN: usize = 2;
const GROUP_NAME_MAX: usize = 24;
const GROUP_ICON_MAX: usize = 64;
const MIN_HISTORY: usize = 10;
const MAX_HISTORY: usize = 500;

#[tauri::command]
pub fn get_history(app: AppHandle) -> Result<Vec<ClipboardItem>, String> {
    let state = app.state::<HistoryLock>();
    let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
    load_history(&app)
}

#[tauri::command]
pub fn toggle_pin(app: AppHandle, id: String) -> Result<Vec<ClipboardItem>, String> {
    if id.is_empty() {
        return Err("id is empty".into());
    }
    let state = app.state::<HistoryLock>();
    let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
    let mut history = load_history(&app)?;
    if let Some(item) = history.iter_mut().find(|i| i.id == id) {
        item.is_pinned = !item.is_pinned;
    }
    save_history(&app, &history)?;
    let _ = app.emit("history-updated", &history);
    Ok(history)
}

#[tauri::command]
pub fn delete_item(app: AppHandle, id: String) -> Result<Vec<ClipboardItem>, String> {
    if id.is_empty() {
        return Err("id is empty".into());
    }
    let state = app.state::<HistoryLock>();
    let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
    let mut history = load_history(&app)?;
    history.retain(|i| i.id != id);
    save_history(&app, &history)?;
    let _ = app.emit("history-updated", &history);
    Ok(history)
}

#[tauri::command]
pub fn clear_history(app: AppHandle) -> Result<Vec<ClipboardItem>, String> {
    let state = app.state::<HistoryLock>();
    let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
    let mut history = load_history(&app)?;
    history.retain(|i| i.is_pinned);
    save_history(&app, &history)?;
    let _ = app.emit("history-updated", &history);
    Ok(history)
}

#[tauri::command]
pub fn paste_item(
    app: AppHandle,
    window: tauri::Window,
    id: String,
    as_plain_text: Option<bool>,
) -> Result<(), String> {
    if id.is_empty() {
        return Err("id is empty".into());
    }
    let item = {
        let state = app.state::<HistoryLock>();
        let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
        load_history(&app)?
            .into_iter()
            .find(|i| i.id == id)
            .ok_or_else(|| "item not found".to_string())?
    };

    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;

    if item.item_type == "text" || as_plain_text == Some(true) {
        clipboard
            .set_text(item.content.clone())
            .map_err(|e| e.to_string())?;
    } else if item.item_type == "image" {
        let img_data = decode_image_data_url(&item.content)
            .ok_or_else(|| "failed to decode image data url".to_string())?;
        clipboard.set_image(img_data).map_err(|e| e.to_string())?;
    } else {
        return Err(format!("unsupported item type: {}", item.item_type));
    }

    let prev_app = read_prev_app(&app);
    let _ = window.hide();
    simulate_paste(prev_app);
    Ok(())
}

#[cfg(target_os = "macos")]
fn read_prev_app(app: &AppHandle) -> Option<String> {
    app.state::<PrevApp>()
        .0
        .lock()
        .ok()
        .and_then(|g| g.clone())
}

#[cfg(not(target_os = "macos"))]
fn read_prev_app(_app: &AppHandle) -> Option<String> {
    None
}

#[tauri::command]
pub fn get_groups(app: AppHandle) -> Result<Vec<Group>, String> {
    load_groups(&app)
}

#[tauri::command]
pub fn add_group(app: AppHandle, group: Group) -> Result<Vec<Group>, String> {
    validate_group(&group)?;
    let mut groups = load_groups(&app)?;
    if groups.iter().any(|g| g.id == group.id) {
        return Err("group id already exists".into());
    }
    groups.push(group);
    save_groups(&app, &groups)?;
    let _ = app.emit("groups-updated", &groups);
    Ok(groups)
}

#[tauri::command]
pub fn update_group(app: AppHandle, group: Group) -> Result<Vec<Group>, String> {
    validate_group(&group)?;
    let mut groups = load_groups(&app)?;
    if let Some(g) = groups.iter_mut().find(|g| g.id == group.id) {
        *g = group;
    } else {
        return Err("group not found".into());
    }
    save_groups(&app, &groups)?;
    let _ = app.emit("groups-updated", &groups);
    Ok(groups)
}

#[tauri::command]
pub fn delete_group(app: AppHandle, id: String) -> Result<Vec<Group>, String> {
    if id.is_empty() {
        return Err("id is empty".into());
    }
    let groups = {
        let state = app.state::<HistoryLock>();
        let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
        let mut groups = load_groups(&app)?;
        groups.retain(|g| g.id != id);
        save_groups(&app, &groups)?;

        let mut history = load_history(&app)?;
        let mut changed = false;
        for item in history.iter_mut() {
            if item.group_id.as_deref() == Some(&id) {
                item.group_id = None;
                changed = true;
            }
        }
        if changed {
            save_history(&app, &history)?;
            let _ = app.emit("history-updated", &history);
        }
        groups
    };
    let _ = app.emit("groups-updated", &groups);
    Ok(groups)
}

#[tauri::command]
pub fn set_item_group(
    app: AppHandle,
    item_id: String,
    group_id: Option<String>,
) -> Result<Vec<ClipboardItem>, String> {
    if item_id.is_empty() {
        return Err("item_id is empty".into());
    }
    let state = app.state::<HistoryLock>();
    let _g = state.0.lock().map_err(|_| "history lock poisoned".to_string())?;
    let mut history = load_history(&app)?;
    if let Some(item) = history.iter_mut().find(|i| i.id == item_id) {
        item.group_id = group_id;
    } else {
        return Err("item not found".into());
    }
    save_history(&app, &history)?;
    let _ = app.emit("history-updated", &history);
    Ok(history)
}

fn validate_group(group: &Group) -> Result<(), String> {
    let name = group.name.trim();
    if name.chars().count() < GROUP_NAME_MIN || name.chars().count() > GROUP_NAME_MAX {
        return Err(format!(
            "group name must be {}-{} characters",
            GROUP_NAME_MIN, GROUP_NAME_MAX
        ));
    }
    if group.icon.is_empty() || group.icon.len() > GROUP_ICON_MAX {
        return Err("group icon name invalid".into());
    }
    if group.id.is_empty() {
        return Err("group id is empty".into());
    }
    Ok(())
}

fn decode_image_data_url(data_url: &str) -> Option<arboard::ImageData<'static>> {
    const PREFIX: &str = "data:image/";
    if !data_url.starts_with(PREFIX) {
        return None;
    }
    let (header, b64) = data_url.split_once(',')?;
    if !header.contains(";base64") {
        return None;
    }
    let bytes = base64_decode(b64)?;

    let img = image::load_from_memory(&bytes).ok()?;
    let rgba = img.to_rgba8();
    let (w, h) = rgba.dimensions();
    let raw: Vec<u8> = rgba.into_raw();
    Some(arboard::ImageData {
        width: w as usize,
        height: h as usize,
        bytes: std::borrow::Cow::Owned(raw),
    })
}

fn base64_decode(input: &str) -> Option<Vec<u8>> {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let input: Vec<u8> = input
        .bytes()
        .filter(|&c| c != b'=' && !c.is_ascii_whitespace())
        .collect();
    let mut out = Vec::with_capacity(input.len() * 3 / 4);
    let index = |c: u8| -> Option<u8> { CHARS.iter().position(|&x| x == c).map(|i| i as u8) };

    for chunk in input.chunks(4) {
        if chunk.len() < 2 {
            return None;
        }
        let a = index(chunk[0])?;
        let b = index(chunk[1])?;
        out.push((a << 2) | (b >> 4));
        if chunk.len() > 2 {
            let c = index(chunk[2])?;
            out.push(((b & 0xf) << 4) | (c >> 2));
            if chunk.len() > 3 {
                let d = index(chunk[3])?;
                out.push(((c & 3) << 6) | d);
            }
        }
    }
    Some(out)
}

fn simulate_paste(prev_app: Option<String>) {
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::thread;
    use std::time::Duration;

    static IN_FLIGHT: AtomicBool = AtomicBool::new(false);
    if IN_FLIGHT
        .compare_exchange(false, true, Ordering::AcqRel, Ordering::Acquire)
        .is_err()
    {
        return;
    }

    thread::spawn(move || {
        thread::sleep(Duration::from_millis(150));

        #[cfg(target_os = "macos")]
        {
            // If we captured the prev frontmost app, activate it first so
            // Cmd+V lands in whatever input had focus before Glyph appeared.
            // Without this step, clicking on Glyph can briefly activate this
            // app and the keystroke goes nowhere useful.
            let script = match &prev_app {
                Some(name) => format!(
                    "tell application \"{}\" to activate\ndelay 0.05\ntell application \"System Events\" to keystroke \"v\" using command down",
                    name.replace('\\', "\\\\").replace('"', "\\\"")
                ),
                None => "tell application \"System Events\" to keystroke \"v\" using command down".to_string(),
            };
            let _ = std::process::Command::new("osascript")
                .args(["-e", &script])
                .output();
        }
        #[cfg(not(target_os = "macos"))]
        let _ = prev_app;

        #[cfg(target_os = "windows")]
        {
            use enigo::{Enigo, Key, Keyboard, Settings};
            if let Ok(mut enigo) = Enigo::new(&Settings::default()) {
                let _ = enigo.key(Key::Control, enigo::Direction::Press);
                let _ = enigo.key(Key::Unicode('v'), enigo::Direction::Click);
                let _ = enigo.key(Key::Control, enigo::Direction::Release);
            }
        }

        #[cfg(target_os = "linux")]
        {
            let result = std::process::Command::new("xdotool")
                .args(["key", "--clearmodifiers", "ctrl+v"])
                .output();

            if result.is_err() {
                use enigo::{Enigo, Key, Keyboard, Settings};
                if let Ok(mut enigo) = Enigo::new(&Settings::default()) {
                    let _ = enigo.key(Key::Control, enigo::Direction::Press);
                    let _ = enigo.key(Key::Unicode('v'), enigo::Direction::Click);
                    let _ = enigo.key(Key::Control, enigo::Direction::Release);
                }
            }
        }

        IN_FLIGHT.store(false, Ordering::Release);
    });
}

#[tauri::command]
pub fn get_settings(app: AppHandle) -> Result<Settings, String> {
    load_settings(&app)
}

#[tauri::command]
pub fn update_settings(app: AppHandle, settings: Settings) -> Result<Settings, String> {
    let mut new_settings = settings;
    new_settings.global_shortcut = new_settings.global_shortcut.trim().to_string();
    if new_settings.global_shortcut.is_empty() {
        return Err("global shortcut cannot be empty".into());
    }
    if new_settings.max_history_size < MIN_HISTORY || new_settings.max_history_size > MAX_HISTORY {
        return Err(format!(
            "max history must be between {} and {}",
            MIN_HISTORY, MAX_HISTORY
        ));
    }
    if !matches!(new_settings.theme.as_str(), "system" | "light" | "dark") {
        return Err("theme must be system, light or dark".into());
    }

    let prev = load_settings(&app).unwrap_or_default();

    if new_settings.global_shortcut != prev.global_shortcut {
        let gs = app.global_shortcut();
        let _ = gs.unregister(prev.global_shortcut.as_str());
        gs.register(new_settings.global_shortcut.as_str())
            .map_err(|e| format!("failed to register shortcut: {}", e))?;
    }

    if new_settings.auto_start != prev.auto_start {
        let auto = app.autolaunch();
        let result = if new_settings.auto_start {
            auto.enable()
        } else {
            auto.disable()
        };
        if let Err(e) = result {
            log::warn!("autostart toggle failed: {}", e);
        }
    }

    if new_settings.always_on_top != prev.always_on_top {
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.set_always_on_top(new_settings.always_on_top);
        }
    }

    #[cfg(target_os = "macos")]
    if new_settings.auto_capture_screenshots != prev.auto_capture_screenshots {
        crate::screenshot_watcher::set_enabled(&app, new_settings.auto_capture_screenshots);
    }

    save_settings(&app, &new_settings)?;
    let _ = app.emit("settings-updated", &new_settings);
    Ok(new_settings)
}

#[tauri::command]
pub fn register_global_shortcut(app: AppHandle, shortcut: String) -> Result<(), String> {
    // Probe-only: register, then unregister, leaving the system in its prior
    // state. Used by the settings UI to detect conflicts before persisting.
    // The actual durable registration happens in `update_settings`.
    let trimmed = shortcut.trim();
    if trimmed.is_empty() {
        return Err("shortcut cannot be empty".into());
    }
    // If the probe target equals our currently-registered shortcut, the OS
    // would (correctly) say it's already registered. That's not a conflict
    // from the user's perspective — they just re-confirmed the same combo.
    let current = load_settings(&app)
        .map(|s| s.global_shortcut)
        .unwrap_or_default();
    if trimmed == current {
        return Ok(());
    }
    let gs = app.global_shortcut();
    gs.register(trimmed)
        .map_err(|e| format!("failed to register shortcut: {}", e))?;
    let _ = gs.unregister(trimmed);
    Ok(())
}

#[tauri::command]
pub fn clear_all_data(app: AppHandle) -> Result<(), String> {
    let state = app.state::<HistoryLock>();
    let _g = state
        .0
        .lock()
        .map_err(|_| "history lock poisoned".to_string())?;
    clear_all(&app)?;
    let empty_history: Vec<ClipboardItem> = Vec::new();
    let empty_groups: Vec<Group> = Vec::new();
    let defaults = Settings::default();
    let _ = app.emit("history-updated", &empty_history);
    let _ = app.emit("groups-updated", &empty_groups);
    let _ = app.emit("settings-updated", &defaults);
    Ok(())
}
