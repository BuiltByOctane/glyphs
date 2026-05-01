use serde::{Deserialize, Serialize};
use std::collections::HashMap;
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



pub struct AppState {
    pub max_history_size: usize,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            max_history_size: 100,
        }
    }
}

pub type SharedState = Mutex<AppState>;



const STORE_PATH: &str = "glyphs-store.json";

pub fn load_history(app: &tauri::AppHandle) -> Vec<ClipboardItem> {
    let store = app.store(STORE_PATH).unwrap();
    store
        .get("history")
        .and_then(|v| serde_json::from_value(v.clone()).ok())
        .unwrap_or_default()
}

pub fn save_history(app: &tauri::AppHandle, history: &[ClipboardItem]) {
    let store = app.store(STORE_PATH).unwrap();
    store.set("history", serde_json::to_value(history).unwrap());
    let _ = store.save();
}

pub fn load_groups(app: &tauri::AppHandle) -> Vec<Group> {
    let store = app.store(STORE_PATH).unwrap();
    store
        .get("groups")
        .and_then(|v| serde_json::from_value(v.clone()).ok())
        .unwrap_or_default()
}

pub fn save_groups(app: &tauri::AppHandle, groups: &[Group]) {
    let store = app.store(STORE_PATH).unwrap();
    store.set("groups", serde_json::to_value(groups).unwrap());
    let _ = store.save();
}

pub fn load_max_history_size(app: &tauri::AppHandle) -> usize {
    let store = app.store(STORE_PATH).unwrap();
    store
        .get("settings")
        .and_then(|v| v.get("maxHistorySize").cloned())
        .and_then(|v| v.as_u64())
        .map(|n| n as usize)
        .unwrap_or(100)
}
