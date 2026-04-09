import { create } from "zustand";

export interface ClipboardItem {
  id: string;
  type: "text" | "image";
  content: string;
  timestamp: number;
  isPinned: boolean;
}

interface ClipboardState {
  items: ClipboardItem[];
  searchQuery: string;
  setItems: (items: ClipboardItem[]) => void;
  setSearchQuery: (query: string) => void;
  loadHistory: () => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
}

export const useClipboardStore = create<ClipboardState>((set) => ({
  items: [],
  searchQuery: "",
  setItems: (items) => set({ items }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  loadHistory: async () => {
    const items = await window.ipcRenderer.getHistory();
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
