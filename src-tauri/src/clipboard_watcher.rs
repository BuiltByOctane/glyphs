use crate::store::{
    load_history, load_max_history_size, save_history, ClipboardItem, HistoryLock,
    MAX_ITEM_BYTES, MIN_UNPINNED_SLOTS,
};
use arboard::Clipboard;
use clipboard_master::{CallbackResult, ClipboardHandler, Master};
use std::io;
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Emitter, Manager};
use uuid::Uuid;

struct Handler {
    app: AppHandle,
    clipboard: Arc<Mutex<Clipboard>>,
    prev_text: String,
    prev_image_hash: u64,
}

impl Handler {
    fn new(app: AppHandle) -> io::Result<Self> {
        let mut clipboard = Clipboard::new().map_err(|e| {
            io::Error::new(io::ErrorKind::Other, format!("clipboard init failed: {}", e))
        })?;
        let prev_text = clipboard.get_text().unwrap_or_default();
        let prev_image_hash = get_image_hash(&mut clipboard);
        Ok(Self {
            app,
            clipboard: Arc::new(Mutex::new(clipboard)),
            prev_text,
            prev_image_hash,
        })
    }
}

fn get_image_hash(clipboard: &mut Clipboard) -> u64 {
    use std::hash::{Hash, Hasher};
    match clipboard.get_image() {
        Ok(img) => {
            let mut hasher = std::collections::hash_map::DefaultHasher::new();
            img.width.hash(&mut hasher);
            img.height.hash(&mut hasher);
            // Hash a sample from the start AND end so two images that share a header
            // (e.g. solid-color images of the same dimensions) don't collide.
            let n = img.bytes.len();
            let head: &[u8] = if n > 256 { &img.bytes[..256] } else { &img.bytes };
            head.hash(&mut hasher);
            if n > 512 {
                img.bytes[n - 256..].hash(&mut hasher);
            }
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

        if let Ok(text) = cb.get_text() {
            if !text.is_empty() && text != self.prev_text && text.len() <= MAX_ITEM_BYTES {
                self.prev_text = text.clone();
                drop(cb);
                if let Err(e) = self.commit_text(text, max_size) {
                    log::warn!("failed to record text clipboard change: {}", e);
                }
                return CallbackResult::Next;
            } else if text.len() > MAX_ITEM_BYTES {
                self.prev_text = text;
                log::info!("skipping text clipboard item over {} bytes", MAX_ITEM_BYTES);
                return CallbackResult::Next;
            }
        }

        let hash = get_image_hash(&mut cb);
        if hash != 0 && hash != self.prev_image_hash {
            self.prev_image_hash = hash;

            if let Ok(img) = cb.get_image() {
                drop(cb);
                if let Some(data_url) = encode_png_data_url(&img) {
                    if data_url.len() > MAX_ITEM_BYTES {
                        log::info!(
                            "skipping image clipboard item over {} bytes",
                            MAX_ITEM_BYTES
                        );
                        return CallbackResult::Next;
                    }
                    if let Err(e) = self.commit_image(data_url, max_size) {
                        log::warn!("failed to record image clipboard change: {}", e);
                    }
                }
            }
        }

        CallbackResult::Next
    }

    fn on_clipboard_error(&mut self, error: io::Error) -> CallbackResult {
        log::warn!("clipboard watcher error: {}", error);
        CallbackResult::Next
    }
}

impl Handler {
    fn commit_text(&self, text: String, max_size: usize) -> Result<(), String> {
        let lock = self.app.state::<HistoryLock>();
        let _g = lock
            .0
            .lock()
            .map_err(|_| "history lock poisoned".to_string())?;
        let mut history = load_history(&self.app)?;
        let item = take_or_new(&mut history, "text", &text);
        history.insert(0, item);
        history = trim_history(history, max_size);
        save_history(&self.app, &history)?;
        let _ = self.app.emit("history-updated", &history);
        Ok(())
    }

    fn commit_image(&self, data_url: String, max_size: usize) -> Result<(), String> {
        commit_image(&self.app, data_url, max_size)
    }
}

pub(crate) fn commit_image(
    app: &AppHandle,
    data_url: String,
    max_size: usize,
) -> Result<(), String> {
    let lock = app.state::<HistoryLock>();
    let _g = lock
        .0
        .lock()
        .map_err(|_| "history lock poisoned".to_string())?;
    let mut history = load_history(app)?;
    let item = take_or_new(&mut history, "image", &data_url);
    history.insert(0, item);
    history = trim_history(history, max_size);
    save_history(app, &history)?;
    let _ = app.emit("history-updated", &history);
    Ok(())
}

// Re-copying an existing item (e.g. via paste-back) must preserve the user's
// pin and group metadata. Look up an existing entry with the same type+content,
// move it to the front, and just bump the timestamp. Otherwise create a new
// item with default metadata.
fn take_or_new(history: &mut Vec<ClipboardItem>, item_type: &str, content: &str) -> ClipboardItem {
    if let Some(pos) = history
        .iter()
        .position(|i| i.item_type == item_type && i.content == content)
    {
        let mut existing = history.remove(pos);
        existing.timestamp = now_ms();
        existing
    } else {
        ClipboardItem {
            id: Uuid::new_v4().to_string(),
            item_type: item_type.to_string(),
            content: content.to_string(),
            timestamp: now_ms(),
            is_pinned: false,
            group_id: None,
        }
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
    // Pinned items are user-managed and never auto-trimmed. Unpinned slots are
    // `max_size - pinned.len()` with a floor of MIN_UNPINNED_SLOTS so a power-user
    // who pins everything still keeps a recent buffer.
    let pinned: Vec<_> = history.iter().filter(|i| i.is_pinned).cloned().collect();
    let mut unpinned: Vec<_> = history.into_iter().filter(|i| !i.is_pinned).collect();

    let unpinned_limit = max_size
        .saturating_sub(pinned.len())
        .max(MIN_UNPINNED_SLOTS);
    unpinned.truncate(unpinned_limit);

    let mut result = Vec::with_capacity(pinned.len() + unpinned.len());
    result.extend(pinned);
    result.extend(unpinned);
    result
}

fn encode_png_data_url(img: &arboard::ImageData) -> Option<String> {
    let width: u32 = img.width.try_into().ok()?;
    let height: u32 = img.height.try_into().ok()?;
    let expected_bytes = (width as usize)
        .checked_mul(height as usize)
        .and_then(|n| n.checked_mul(4))?;
    if img.bytes.len() < expected_bytes {
        return None;
    }

    let mut png_bytes: Vec<u8> = Vec::new();
    {
        let mut encoder = png::Encoder::new(std::io::Cursor::new(&mut png_bytes), width, height);
        encoder.set_color(png::ColorType::Rgba);
        encoder.set_depth(png::BitDepth::Eight);
        let mut writer = encoder.write_header().ok()?;
        writer.write_image_data(&img.bytes[..expected_bytes]).ok()?;
    }
    let b64 = base64_encode(&png_bytes);
    Some(format!("data:image/png;base64,{}", b64))
}

pub(crate) fn base64_encode(data: &[u8]) -> String {
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
        let mut backoff = Duration::from_secs(1);
        let max_backoff = Duration::from_secs(60);
        loop {
            let handler = match Handler::new(app.clone()) {
                Ok(h) => h,
                Err(e) => {
                    log::error!("clipboard watcher init failed, retrying: {}", e);
                    let _ = app.emit("watcher-error", e.to_string());
                    thread::sleep(backoff);
                    backoff = (backoff * 2).min(max_backoff);
                    continue;
                }
            };
            backoff = Duration::from_secs(1);
            if let Err(e) = Master::new(handler).run() {
                log::error!("clipboard watcher stopped: {}, restarting", e);
                let _ = app.emit("watcher-error", e.to_string());
                thread::sleep(backoff);
                backoff = (backoff * 2).min(max_backoff);
            } else {
                break;
            }
        }
    });
}
