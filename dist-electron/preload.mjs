"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  getHistory: () => electron.ipcRenderer.invoke("get-history"),
  togglePin: (id) => electron.ipcRenderer.invoke("toggle-pin", id),
  deleteItem: (id) => electron.ipcRenderer.invoke("delete-item", id),
  clearHistory: () => electron.ipcRenderer.invoke("clear-history"),
  pasteItem: (id, asPlainText = false) => electron.ipcRenderer.invoke("paste-item", id, asPlainText),
  onHistoryUpdated: (callback) => {
    electron.ipcRenderer.on("history-updated", (_event, data) => callback(data));
  },
  getGroups: () => electron.ipcRenderer.invoke("get-groups"),
  addGroup: (group) => electron.ipcRenderer.invoke("add-group", group),
  updateGroup: (group) => electron.ipcRenderer.invoke("update-group", group),
  deleteGroup: (id) => electron.ipcRenderer.invoke("delete-group", id),
  setItemGroup: (itemId, groupId) => electron.ipcRenderer.invoke("set-item-group", itemId, groupId)
});
