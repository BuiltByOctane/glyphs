import { clipboard, BrowserWindow } from "electron";
import store, { ClipboardItem } from "./store";
import { v4 as uuidv4 } from "uuid";

let previousText = clipboard.readText();
let previousImage = clipboard.readImage().toDataURL();
let watcherInterval: NodeJS.Timeout | null = null;

export function startClipboardWatcher(mainWindow: BrowserWindow) {
  if (watcherInterval) clearInterval(watcherInterval);

  watcherInterval = setInterval(() => {
    try {
      const currentText = clipboard.readText();
      const currentImage = clipboard.readImage();
      const currentImageURL = currentImage.isEmpty()
        ? ""
        : currentImage.toDataURL();

      let isChanged = false;
      let newItem: ClipboardItem | null = null;
      const maxHistorySize = store.get("settings.maxHistorySize") || 100;

      if (currentText && currentText !== previousText) {
        previousText = currentText;
        isChanged = true;
        newItem = {
          id: uuidv4(),
          type: "text",
          content: currentText,
          timestamp: Date.now(),
          isPinned: false,
        };
      } else if (!currentImage.isEmpty() && currentImageURL !== previousImage) {
        previousImage = currentImageURL;
        isChanged = true;
        newItem = {
          id: uuidv4(),
          type: "image",
          content: currentImageURL,
          timestamp: Date.now(),
          isPinned: false,
        };
      }

      if (isChanged && newItem) {
        // Retrieve current history
        let history = store.get("history") || [];

        // Remove duplicate text content if exists
        if (newItem.type === "text") {
          history = history.filter((item) => item.content !== newItem?.content);
        }

        // Add to top
        history.unshift(newItem);

        // Separate pinned and unpinned to enforce limit only on unpinned
        const pinned = history.filter((i) => i.isPinned);
        let unpinned = history.filter((i) => !i.isPinned);

        // Trim unpinned to fit within (maxSize - pinned.length) or similar logic
        // Simple logic: limit the total size to maxHistorySize, but never delete pinned items
        if (history.length > maxHistorySize) {
          unpinned = unpinned.slice(
            0,
            Math.max(0, maxHistorySize - pinned.length),
          );
        }

        // Reconstruct history
        history = [...pinned, ...unpinned];

        // Save
        store.set("history", history);

        // Notify UI
        mainWindow.webContents.send("history-updated", history);
      }
    } catch (e) {
      console.error("Error in clipboard watcher:", e);
    }
  }, 500); // Check every 500ms
}

export function stopClipboardWatcher() {
  if (watcherInterval) {
    clearInterval(watcherInterval);
    watcherInterval = null;
  }
}
