use crate::store::{load_history, load_max_history_size, save_history, ClipboardItem};
use arboard::Clipboard;
use clipboard_master::{CallbackResult, ClipboardHandler, Master};
use std::io;
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter};
use uuid::Uuid;

struct Handler {
    app: AppHandle,
    clipboard: Arc<Mutex<Clipboard>>,
    prev_text: String,
    prev_image_hash: u64,
}

impl Handler {
    fn new(app: AppHandle) -> Self {
        let mut clipboard = Clipboard::new().expect("Failed to open clipboard");
        let prev_text = clipboard.get_text().unwrap_or_default();
        let prev_image_hash = get_image_hash(&mut clipboard);
        Self {
            app,
            clipboard: Arc::new(Mutex::new(clipboard)),
            prev_text,
            prev_image_hash,
        }
    }
}

fn get_image_hash(clipboard: &mut Clipboard) -> u64 {
    use std::hash::{Hash, Hasher};
    match clipboard.get_image() {
        Ok(img) => {
            let mut hasher = std::collections::hash_map::DefaultHasher::new();
            img.width.hash(&mut hasher);
            img.height.hash(&mut hasher);
            let sample: &[u8] = if img.bytes.len() > 512 {
                &img.bytes[..512]
            } else {
                &img.bytes
            };
            sample.hash(&mut hasher);
            hasher.finish()
        }
        Err(_) => 0,
    }
}

impl ClipboardHandler for Handler {
    fn on_clipboard_change(&mut self) -> CallbackResult {
        let mut cb = match self.clipboard.lock() {
            Ok(c) => c,
            Err(_) => return CallbackResult::Next,
        };

        let max_size = load_max_history_size(&self.app);
        let mut history = load_history(&self.app);

        if let Ok(text) = cb.get_text() {
            if !text.is_empty() && text != self.prev_text {
                self.prev_text = text.clone();

                history.retain(|i| !(i.item_type == "text" && i.content == text));

                let item = ClipboardItem {
                    id: Uuid::new_v4().to_string(),
                    item_type: "text".to_string(),
                    content: text,
                    timestamp: now_ms(),
                    is_pinned: false,
                    group_id: None,
                };
                history.insert(0, item);
                history = trim_history(history, max_size);
                save_history(&self.app, &history);
                let _ = self.app.emit("history-updated", &history);
                return CallbackResult::Next;
            }
        }

        let hash = get_image_hash(&mut cb);
        if hash != 0 && hash != self.prev_image_hash {
            self.prev_image_hash = hash;

            if let Ok(img) = cb.get_image() {
                if let Some(data_url) = encode_png_data_url(&img) {
                    let item = ClipboardItem {
                        id: Uuid::new_v4().to_string(),
                        item_type: "image".to_string(),
                        content: data_url,
                        timestamp: now_ms(),
                        is_pinned: false,
                        group_id: None,
                    };
                    history.insert(0, item);
                    history = trim_history(history, max_size);
                    save_history(&self.app, &history);
                    let _ = self.app.emit("history-updated", &history);
                }
            }
        }

        CallbackResult::Next
    }

    fn on_clipboard_error(&mut self, _error: io::Error) -> CallbackResult {
        CallbackResult::Next
    }
}

fn now_ms() -> i64 {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}

fn trim_history(history: Vec<ClipboardItem>, max_size: usize) -> Vec<ClipboardItem> {
    let pinned: Vec<_> = history.iter().filter(|i| i.is_pinned).cloned().collect();
    let mut unpinned: Vec<_> = history.into_iter().filter(|i| !i.is_pinned).collect();

    let unpinned_limit = max_size.saturating_sub(pinned.len());
    unpinned.truncate(unpinned_limit);

    let mut result = Vec::with_capacity(pinned.len() + unpinned.len());
    result.extend(pinned);
    result.extend(unpinned);
    result
}

fn encode_png_data_url(img: &arboard::ImageData) -> Option<String> {
    use std::io::Write;
    let mut png_bytes: Vec<u8> = Vec::new();
    {
        let mut encoder = png::Encoder::new(
            std::io::Cursor::new(&mut png_bytes),
            img.width as u32,
            img.height as u32,
        );
        encoder.set_color(png::ColorType::Rgba);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().ok()?;
        writer.write_image_data(&img.bytes).ok()?;
    }
    let b64 = base64_encode(&png_bytes);
    Some(format!("data:image/png;base64,{}", b64))
}

fn base64_encode(data: &[u8]) -> String {
    use std::fmt::Write;
    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut out = String::with_capacity((data.len() + 2) / 3 * 4);
    for chunk in data.chunks(3) {
        let b0 = chunk[0] as usize;
        let b1 = if chunk.len() > 1 { chunk[1] as usize } else { 0 };
        let b2 = if chunk.len() > 2 { chunk[2] as usize } else { 0 };
        out.push(CHARS[b0 >> 2] as char);
        out.push(CHARS[((b0 & 3) << 4) | (b1 >> 4)] as char);
        if chunk.len() > 1 {
            out.push(CHARS[((b1 & 0xf) << 2) | (b2 >> 6)] as char);
        } else {
            out.push('=');
        }
        if chunk.len() > 2 {
            out.push(CHARS[b2 & 0x3f] as char);
        } else {
            out.push('=');
        }
    }
    out
}

pub fn start_clipboard_watcher(app: AppHandle) {
    thread::spawn(move || {
        let handler = Handler::new(app);
        if let Err(e) = Master::new(handler).run() {
            log::error!("Clipboard watcher stopped: {}", e);
        }
    });
}
