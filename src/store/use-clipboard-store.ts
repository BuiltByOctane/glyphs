import { create } from "zustand";

export interface Group {
  id: string;
  name: string;
  icon: string;
}

export interface ClipboardItem {
  id: string;
  type: "text" | "image";
  content: string;
  timestamp: number;
  isPinned: boolean;
  groupId?: string;
}

interface ClipboardState {
  items: ClipboardItem[];
  groups: Group[];
  activeGroupId: string;
  searchQuery: string;
  setItems: (items: ClipboardItem[]) => void;
  setGroups: (groups: Group[]) => void;
  setActiveGroupId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  loadHistory: () => Promise<void>;
  loadGroups: () => Promise<void>;
  addGroup: (group: Group) => Promise<void>;
  updateGroup: (group: Group) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  setItemGroup: (itemId: string, groupId?: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  items: [],
  groups: [],
  activeGroupId: "all",
  searchQuery: "",
  setItems: (items) => set({ items }),
  setGroups: (groups) => set({ groups }),
  setActiveGroupId: (activeGroupId) => set({ activeGroupId }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  loadHistory: async () => {
    const items = await window.ipcRenderer.getHistory();
    set({ items });
  },
  loadGroups: async () => {
    const groups = await window.ipcRenderer.getGroups();
    set({ groups });
  },
  addGroup: async (group) => {
    const groups = await window.ipcRenderer.addGroup(group);
    set({ groups });
  },
  updateGroup: async (group) => {
    const groups = await window.ipcRenderer.updateGroup(group);
    set({ groups });
  },
  deleteGroup: async (id) => {
    const groups = await window.ipcRenderer.deleteGroup(id);
    set({ groups, activeGroupId: "all" });
  },
  setItemGroup: async (itemId, groupId) => {
    const items = await window.ipcRenderer.setItemGroup(itemId, groupId);
    /* state updated via history-updated event or manually */
    set({ items });
  },
  togglePin: async (id) => {
    const items = await window.ipcRenderer.togglePin(id);
    set({ items });
  },
  deleteItem: async (id) => {
    const items = await window.ipcRenderer.deleteItem(id);
    set({ items });
  },
  clearHistory: async () => {
    const items = await window.ipcRenderer.clearHistory();
    set({ items });
  },
  pasteItem: async (id, asPlainText = false) => {
    try {
      await window.ipcRenderer.pasteItem(id, asPlainText);
    } catch (e) {
      console.error("Paste error", e);
    }
  },
}));

window.ipcRenderer.onHistoryUpdated((items: ClipboardItem[]) => {
  useClipboardStore.getState().setItems(items);
});
