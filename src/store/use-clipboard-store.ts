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

type HistoryListener = (items: ClipboardItem[]) => void;
type IpcRendererBridge = Window["ipcRenderer"];

function createDevIpcRenderer(): IpcRendererBridge {
  let items: ClipboardItem[] = [
    {
      id: "sample-1",
      type: "text",
      content:
        "Pinned deployment command with a deliberately long value that should truncate cleanly without pushing action buttons offscreen.",
      timestamp: Date.now() - 1000,
      isPinned: true,
      groupId: "work",
    },
    {
      id: "sample-2",
      type: "text",
      content:
        "https://example.com/a/very/long/path/that/keeps/going?with=query-values&and=layout-pressure",
      timestamp: Date.now() - 2000,
      isPinned: false,
      groupId: "links",
    },
    {
      id: "sample-3",
      type: "image",
      content:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='120'%3E%3Crect width='240' height='120' fill='%23262626'/%3E%3Ccircle cx='70' cy='60' r='36' fill='%23ffffff' fill-opacity='.28'/%3E%3Crect x='118' y='36' width='82' height='48' rx='8' fill='%23ffffff' fill-opacity='.42'/%3E%3C/svg%3E",
      timestamp: Date.now() - 3000,
      isPinned: false,
    },
    {
      id: "sample-4",
      type: "text",
      content: "Short snippet",
      timestamp: Date.now() - 4000,
      isPinned: false,
    },
  ];

  let groups: Group[] = [
    { id: "work", name: "Work", icon: "Briefcase" },
    { id: "links", name: "Reference Links", icon: "Globe" },
    { id: "snippets", name: "Snippets", icon: "Code" },
    { id: "ideas", name: "Ideas With A Long Name", icon: "Lightbulb" },
  ];

  const listeners = new Set<HistoryListener>();
  const cloneItems = () => items.map((item) => ({ ...item }));
  const cloneGroups = () => groups.map((group) => ({ ...group }));
  const notifyHistory = () => {
    const currentItems = cloneItems();
    listeners.forEach((listener) => listener(currentItems));
  };

  return {
    getHistory: async () => cloneItems(),
    togglePin: async (id) => {
      items = items.map((item) =>
        item.id === id ? { ...item, isPinned: !item.isPinned } : item,
      );
      notifyHistory();
      return cloneItems();
    },
    deleteItem: async (id) => {
      items = items.filter((item) => item.id !== id);
      notifyHistory();
      return cloneItems();
    },
    clearHistory: async () => {
      items = items.filter((item) => item.isPinned);
      notifyHistory();
      return cloneItems();
    },
    pasteItem: async () => undefined,
    onHistoryUpdated: (callback) => {
      listeners.add(callback);
    },
    getGroups: async () => cloneGroups(),
    addGroup: async (group) => {
      groups = [...groups, group];
      return cloneGroups();
    },
    updateGroup: async (group) => {
      groups = groups.map((current) =>
        current.id === group.id ? group : current,
      );
      return cloneGroups();
    },
    deleteGroup: async (id) => {
      groups = groups.filter((group) => group.id !== id);
      items = items.map((item) => {
        if (item.groupId !== id) return item;
        const nextItem = { ...item };
        delete nextItem.groupId;
        return nextItem;
      });
      notifyHistory();
      return cloneGroups();
    },
    setItemGroup: async (itemId, groupId) => {
      items = items.map((item) =>
        item.id === itemId ? { ...item, groupId } : item,
      );
      notifyHistory();
      return cloneItems();
    },
  };
}

const ipcRenderer =
  window.ipcRenderer ?? (import.meta.env.DEV ? createDevIpcRenderer() : null);

if (!ipcRenderer) {
  throw new Error("Electron IPC bridge is unavailable.");
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
    const items = await ipcRenderer.getHistory();
    set({ items });
  },
  loadGroups: async () => {
    const groups = await ipcRenderer.getGroups();
    set({ groups });
  },
  addGroup: async (group) => {
    const groups = await ipcRenderer.addGroup(group);
    set({ groups });
  },
  updateGroup: async (group) => {
    const groups = await ipcRenderer.updateGroup(group);
    set({ groups });
  },
  deleteGroup: async (id) => {
    const groups = await ipcRenderer.deleteGroup(id);
    set({ groups, activeGroupId: "all" });
  },
  setItemGroup: async (itemId, groupId) => {
    const items = await ipcRenderer.setItemGroup(itemId, groupId);
    /* state updated via history-updated event or manually */
    set({ items });
  },
  togglePin: async (id) => {
    const items = await ipcRenderer.togglePin(id);
    set({ items });
  },
  deleteItem: async (id) => {
    const items = await ipcRenderer.deleteItem(id);
    set({ items });
  },
  clearHistory: async () => {
    const items = await ipcRenderer.clearHistory();
    set({ items });
  },
  pasteItem: async (id, asPlainText = false) => {
    try {
      await ipcRenderer.pasteItem(id, asPlainText);
    } catch (e) {
      console.error("Paste error", e);
    }
  },
}));

ipcRenderer.onHistoryUpdated((items: ClipboardItem[]) => {
  useClipboardStore.getState().setItems(items);
});
