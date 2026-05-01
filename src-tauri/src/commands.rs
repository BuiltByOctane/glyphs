use crate::store::*;
use arboard::Clipboard;
use tauri::{AppHandle, Emitter};

#[tauri::command]
pub fn get_history(app: AppHandle) -> Vec<ClipboardItem> {
    load_history(&app)
}

#[tauri::command]
pub fn toggle_pin(app: AppHandle, id: String) -> Vec<ClipboardItem> {
    let mut history = load_history(&app);
    if let Some(item) = history.iter_mut().find(|i| i.id == id) {
        item.is_pinned = !item.is_pinned;
    }
    save_history(&app, &history);
    history
}

#[tauri::command]
pub fn delete_item(app: AppHandle, id: String) -> Vec<ClipboardItem> {
    let mut history = load_history(&app);
    history.retain(|i| i.id != id);
    save_history(&app, &history);
    history
}

#[tauri::command]
pub fn clear_history(app: AppHandle) -> Vec<ClipboardItem> {
    let mut history = load_history(&app);
    history.retain(|i| i.is_pinned);
    save_history(&app, &history);
    history
}

#[tauri::command]
pub fn paste_item(
    app: AppHandle,
    window: tauri::Window,
    id: String,
    as_plain_text: Option<bool>,
) -> Result<(), String> {
    let history = load_history(&app);
    let item = history.iter().find(|i| i.id == id).ok_or("Item not found")?;

    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;

    if item.item_type == "text" {
        clipboard
            .set_text(item.content.clone())
            .map_err(|e| e.to_string())?;
    } else if item.item_type == "image" && as_plain_text != Some(true) {
        if let Some(img_data) = decode_image_data_url(&item.content) {
            clipboard
                .set_image(img_data)
                .map_err(|e| e.to_string())?;
        }
    } else {
        return Ok(());
    }

    let _ = window.hide();
    simulate_paste();
    Ok(())
}

#[tauri::command]
pub fn get_groups(app: AppHandle) -> Vec<Group> {
    load_groups(&app)
}

#[tauri::command]
pub fn add_group(app: AppHandle, group: Group) -> Vec<Group> {
    let mut groups = load_groups(&app);
    groups.push(group);
    save_groups(&app, &groups);
    groups
}

#[tauri::command]
pub fn update_group(app: AppHandle, group: Group) -> Vec<Group> {
    let mut groups = load_groups(&app);
    if let Some(g) = groups.iter_mut().find(|g| g.id == group.id) {
        *g = group;
    }
    save_groups(&app, &groups);
    groups
}

#[tauri::command]
pub fn delete_group(app: AppHandle, id: String) -> Vec<Group> {
    let mut groups = load_groups(&app);
    groups.retain(|g| g.id != id);
    save_groups(&app, &groups);

    let mut history = load_history(&app);
    let mut changed = false;
    for item in history.iter_mut() {
        if item.group_id.as_deref() == Some(&id) {
            item.group_id = None;
            changed = true;
        }
    }
    if changed {
        save_history(&app, &history);
        let _ = app.emit("history-updated", &history);
    }

    groups
}

#[tauri::command]
pub fn set_item_group(
    app: AppHandle,
    item_id: String,
    group_id: Option<String>,
) -> Vec<ClipboardItem> {
    let mut history = load_history(&app);
    if let Some(item) = history.iter_mut().find(|i| i.id == item_id) {
        item.group_id = group_id;
    }
    save_history(&app, &history);
    let _ = app.emit("history-updated", &history);
    history
}

fn decode_image_data_url(data_url: &str) -> Option<arboard::ImageData<'static>> {
    let b64 = data_url.split(',').nth(1)?;
    let bytes = base64_decode(b64)?;

    if let Ok(img) = image::load_from_memory(&bytes) {
        let rgba = img.to_rgba8();
        let (w, h) = rgba.dimensions();
        let raw: Vec<u8> = rgba.into_raw();
        Some(arboard::ImageData {
            width: w as usize,
            height: h as usize,
            bytes: std::borrow::Cow::Owned(raw),
        })
    } else {
        None
    }
}

fn base64_decode(input: &str) -> Option<Vec<u8>> {
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let input: Vec<u8> = input.bytes().filter(|&c| c != b'=').collect();
    let mut out = Vec::with_capacity(input.len() * 3 / 4);
    let index = |c: u8| -> Option<u8> { CHARS.iter().position(|&x| x == c).map(|i| i as u8) };

    for chunk in input.chunks(4) {
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

fn simulate_paste() {
    use std::thread;
    use std::time::Duration;

    thread::spawn(|| {
        thread::sleep(Duration::from_millis(150));

        #[cfg(target_os = "macos")]
        {
            let _ = std::process::Command::new("osascript")
                .args([
                    "-e",
                    "tell application \"System Events\" to keystroke \"v\" using command down",
                ])
                .output();
        }

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
    });
}
