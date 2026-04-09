import { ipcMain, clipboard, nativeImage, BrowserWindow } from "electron";
import store from "./store";
import { exec } from "child_process";

export function setupIpcHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle("get-history", () => {
    return store.get("history") || [];
  });

  ipcMain.handle("toggle-pin", (_, id: string) => {
    let history = store.get("history") || [];
    const index = history.findIndex((i) => i.id === id);
    if (index !== -1) {
      history[index].isPinned = !history[index].isPinned;
      store.set("history", history);
    }
    return history;
  });

  ipcMain.handle("delete-item", (_, id: string) => {
    let history = store.get("history") || [];
    history = history.filter((i) => i.id !== id);
    store.set("history", history);
    return history;
  });

  ipcMain.handle("clear-history", () => {
    let history = store.get("history") || [];
    history = history.filter((i) => i.isPinned);
    store.set("history", history);
    return history;
  });

  ipcMain.handle("paste-item", (_, id: string, asPlainText = false) => {
    const history = store.get("history") || [];
    const item = history.find((i) => i.id === id);

    if (item) {
      if (item.type === "text") {
        clipboard.writeText(item.content);
      } else if (item.type === "image") {
        if (asPlainText) {
          return;
        }
        const image = nativeImage.createFromDataURL(item.content);
        clipboard.writeImage(image);
      }

      mainWindow.hide();

      setTimeout(() => {
        exec(
          `osascript -e 'tell application "System Events" to keystroke "v" using command down'`,
          (err) => {
            if (err) {
              console.error("Failed to execute AppleScript:", err);
            }
          },
        );
      }, 100);
    }
  });
}
