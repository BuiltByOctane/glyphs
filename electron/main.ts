import {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  startClipboardWatcher,
  stopClipboardWatcher,
} from "./clipboard-watcher";
import { setupIpcHandlers } from "./ipc-handlers";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let tray: Tray | null;

function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 450,
    show: true, // Show clearly for debugging
    frame: false,
    transparent: true,
    vibrancy: "popover",
    visualEffectState: "active",
    backgroundColor: "#00000000",
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  startClipboardWatcher(win);

  setupIpcHandlers(win);

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }

  win.on("blur", () => {
    if (!win?.webContents.isDevToolsOpened()) {
      win?.hide();
    }
  });
}

function toggleWindow() {
  if (win?.isVisible()) {
    win.hide();
  } else {
    win?.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    win?.show();
    win?.focus();
  }
}

app.on("will-quit", () => {
  stopClipboardWatcher();
  globalShortcut.unregisterAll();
});

app.whenReady().then(() => {
  if (app.dock) {
    app.dock.hide();
  }

  createWindow();

  const icon = nativeImage.createEmpty();
  tray = new Tray(icon);
  tray.setToolTip("Glyph Clipboard");
  const contextMenu = Menu.buildFromTemplate([
    { label: "Show Glyph", click: () => toggleWindow() },
    { type: "separator" },
    { label: "Quit", click: () => app.quit() },
  ]);
  tray.setContextMenu(contextMenu);

  globalShortcut.register("CommandOrControl+Shift+V", () => {
    toggleWindow();
  });
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
