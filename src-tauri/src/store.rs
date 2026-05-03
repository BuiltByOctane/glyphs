use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri_plugin_store::StoreExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClipboardItem {
    pub id: String,
    #[serde(rename = "type")]
    pub item_type: String,
    pub content: String,
    pub timestamp: i64,
    pub is_pinned: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub group_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Group {
    pub id: String,
    pub name: String,
    pub icon: String,
}

pub struct HistoryLock(pub Mutex<()>);

impl Default for HistoryLock {
    fn default() -> Self {
        Self(Mutex::new(()))
    }
}

// Tracks the frontmost application at the moment Glyph was shown, so we can
// re-activate it before simulating Cmd+V (otherwise the paste lands in Glyph
// itself if clicking the window activated this app).
pub struct PrevApp(pub Mutex<Option<String>>);

impl Default for PrevApp {
    fn default() -> Self {
        Self(Mutex::new(None))
    }
}

const STORE_PATH: &str = "glyphs-store.json";
pub const DEFAULT_MAX_HISTORY_SIZE: usize = 100;
pub const MIN_UNPINNED_SLOTS: usize = 10;
pub const MAX_ITEM_BYTES: usize = 5 * 1024 * 1024;

pub fn load_history(app: &tauri::AppHandle) -> Result<Vec<ClipboardItem>, String> {
    let store = app.store(STORE_PATH).map_err(|e| e.to_string())?;
    Ok(store
        .get("history")
        .and_then(|v| serde_json::from_value(v.clone()).ok())
        .unwrap_or_default())
}

pub fn save_history(app: &tauri::AppHandle, history: &[ClipboardItem]) -> Result<(), String> {
    let store = app.store(STORE_PATH).map_err(|e| e.to_string())?;
    let value = serde_json::to_value(history).map_err(|e| e.to_string())?;
    store.set("history", value);
    store.save().map_err(|e| e.to_string())
}

pub fn load_groups(app: &tauri::AppHandle) -> Result<Vec<Group>, String> {
    let store = app.store(STORE_PATH).map_err(|e| e.to_string())?;
    Ok(store
        .get("groups")
        .and_then(|v| serde_json::from_value(v.clone()).ok())
        .unwrap_or_default())
}

pub fn save_groups(app: &tauri::AppHandle, groups: &[Group]) -> Result<(), String> {
    let store = app.store(STORE_PATH).map_err(|e| e.to_string())?;
    let value = serde_json::to_value(groups).map_err(|e| e.to_string())?;
    store.set("groups", value);
    store.save().map_err(|e| e.to_string())
}

pub fn load_max_history_size(app: &tauri::AppHandle) -> usize {
    let Ok(store) = app.store(STORE_PATH) else {
        return DEFAULT_MAX_HISTORY_SIZE;
    };
    store
        .get("settings")
        .and_then(|v| v.get("maxHistorySize").cloned())
        .and_then(|v| v.as_u64())
        .map(|n| n as usize)
        .unwrap_or(DEFAULT_MAX_HISTORY_SIZE)
}
