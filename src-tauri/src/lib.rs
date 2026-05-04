mod clipboard_watcher;
mod commands;
mod store;

use crate::store::{load_settings, HistoryLock, PrevApp, Settings};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager,
};
use tauri_plugin_autostart::ManagerExt as AutostartManagerExt;

pub fn run() {
    let mut builder = tauri::Builder::default()
        .manage(HistoryLock::default())
        .manage(PrevApp::default())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ));

    // The global shortcut plugin needs its key combo at builder time, so we
    // register the default Cmd+B here and reconcile to the user's persisted
    // shortcut in setup() below if it differs.
    let shortcut_plugin = tauri_plugin_global_shortcut::Builder::new()
        .with_shortcut(Settings::default().global_shortcut.as_str())
        .map(|b| {
            b.with_handler(|app, _shortcut, event| {
                if event.state() == tauri_plugin_global_shortcut::ShortcutState::Pressed {
                    toggle_window(app);
                }
            })
            .build()
        });

    builder = match shortcut_plugin {
        Ok(plugin) => builder.plugin(plugin),
        Err(e) => {
            log::error!(
                "Failed to register default global shortcut: {}. The app will run without it.",
                e
            );
            builder
        }
    };

    builder
        .invoke_handler(tauri::generate_handler![
            commands::get_history,
            commands::toggle_pin,
            commands::delete_item,
            commands::clear_history,
            commands::paste_item,
            commands::get_groups,
            commands::add_group,
            commands::update_group,
            commands::delete_group,
            commands::set_item_group,
            commands::get_settings,
            commands::update_settings,
            commands::register_global_shortcut,
            commands::clear_all_data,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            let app_handle = app.handle().clone();

            #[cfg(target_os = "macos")]
            {
                if let Some(win) = app.get_webview_window("main") {
                    let _ = window_vibrancy::apply_vibrancy(
                        &win,
                        window_vibrancy::NSVisualEffectMaterial::Popover,
                        None,
                        Some(16.0),
                    );
                }
            }

            // Apply persisted settings: shortcut, always-on-top, autostart.
            let settings = load_settings(app.handle()).unwrap_or_default();
            let defaults = Settings::default();

            if settings.global_shortcut != defaults.global_shortcut {
                use tauri_plugin_global_shortcut::GlobalShortcutExt;
                let gs = app.global_shortcut();
                let _ = gs.unregister(defaults.global_shortcut.as_str());
                if let Err(e) = gs.register(settings.global_shortcut.as_str()) {
                    log::warn!(
                        "failed to register persisted shortcut '{}': {}. Falling back to default.",
                        settings.global_shortcut,
                        e
                    );
                    let _ = gs.register(defaults.global_shortcut.as_str());
                }
            }

            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_always_on_top(settings.always_on_top);
            }

            // Reconcile auto-start with the persisted setting.
            let auto = app.autolaunch();
            let currently_enabled = auto.is_enabled().unwrap_or(false);
            if settings.auto_start && !currently_enabled {
                if let Err(e) = auto.enable() {
                    log::warn!("failed to enable autostart: {}", e);
                }
            } else if !settings.auto_start && currently_enabled {
                if let Err(e) = auto.disable() {
                    log::warn!("failed to disable autostart: {}", e);
                }
            }

            let show_item = MenuItem::with_id(app, "show", "Show Glyphs", true, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .menu(&menu)
                .icon(app.default_window_icon().unwrap().clone())
                .icon_as_template(false)
                .tooltip("Glyphs Clipboard")
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "show" => toggle_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_window(&tray.app_handle().clone());
                    }
                })
                .build(app)?;

            clipboard_watcher::start_clipboard_watcher(app_handle);

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Focused(false) = event {
                // Re-read settings each time so the toggle takes effect without restart.
                let hide = load_settings(window.app_handle())
                    .map(|s| s.hide_on_blur)
                    .unwrap_or(true);
                if hide {
                    let _ = window.hide();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn toggle_window(app: &tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().unwrap_or(false) {
            let _ = window.hide();
        } else {
            #[cfg(target_os = "macos")]
            capture_prev_app(app);
            let _ = window.set_visible_on_all_workspaces(true);
            let _ = window.show();
            let _ = window.set_focus();
            let _ = app.emit("window-shown", ());
        }
    }
}

#[cfg(target_os = "macos")]
fn capture_prev_app(app: &tauri::AppHandle) {
    // Spawn a background thread so we don't block the show. The osascript
    // call takes ~50-100ms; we accept a small race where a very fast click
    // could land before the capture finishes (in which case simulate_paste
    // falls back to its no-prev-app path).
    let app_handle = app.clone();
    std::thread::spawn(move || {
        let output = std::process::Command::new("osascript")
            .args([
                "-e",
                "tell application \"System Events\" to name of first application process whose frontmost is true",
            ])
            .output();
        if let Ok(out) = output {
            let name = String::from_utf8_lossy(&out.stdout).trim().to_string();
            // Reject our own name — that means show() activated us first and
            // the previous app is already lost. Keep whatever was captured
            // last so a stale-but-correct value beats nothing.
            if !name.is_empty() && name != "Glyphs" {
                if let Some(state) = app_handle.try_state::<PrevApp>() {
                    if let Ok(mut prev) = state.0.lock() {
                        *prev = Some(name);
                    }
                }
            }
        }
    });
}
