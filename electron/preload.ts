import { ipcRenderer, contextBridge } from "electron";
import type { ClipboardItem, Group } from "./store";

contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args),
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },

  getHistory: () => ipcRenderer.invoke("get-history"),
  togglePin: (id: string) => ipcRenderer.invoke("toggle-pin", id),
  deleteItem: (id: string) => ipcRenderer.invoke("delete-item", id),
  clearHistory: () => ipcRenderer.invoke("clear-history"),
  pasteItem: (id: string, asPlainText = false) =>
    ipcRenderer.invoke("paste-item", id, asPlainText),
  onHistoryUpdated: (callback: (data: ClipboardItem[]) => void) => {
    ipcRenderer.on("history-updated", (_event, data) => callback(data));
  },
  getGroups: () => ipcRenderer.invoke("get-groups"),
  addGroup: (group: Group) => ipcRenderer.invoke("add-group", group),
  updateGroup: (group: Group) => ipcRenderer.invoke("update-group", group),
  deleteGroup: (id: string) => ipcRenderer.invoke("delete-group", id),
  setItemGroup: (itemId: string, groupId?: string) => 
    ipcRenderer.invoke("set-item-group", itemId, groupId),
});
