import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

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

// Rust uses camelCase via serde rename_all but we map snake_case fields here
function mapItem(raw: Record<string, unknown>): ClipboardItem {
  return {
    id: raw.id as string,
    type: (raw.item_type ?? raw.type) as "text" | "image",
    content: raw.content as string,
    timestamp: raw.timestamp as number,
    isPinned: (raw.is_pinned ?? raw.isPinned) as boolean,
    groupId: (raw.group_id ?? raw.groupId) as string | undefined,
  };
}

function mapItems(raws: Record<string, unknown>[]): ClipboardItem[] {
  return raws.map(mapItem);
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
    const raw = await invoke<Record<string, unknown>[]>("get_history");
    set({ items: mapItems(raw) });
  },

  loadGroups: async () => {
    const groups = await invoke<Group[]>("get_groups");
    set({ groups });
  },

  addGroup: async (group) => {
    const groups = await invoke<Group[]>("add_group", { group });
    set({ groups });
  },

  updateGroup: async (group) => {
    const groups = await invoke<Group[]>("update_group", { group });
    set({ groups });
  },

  deleteGroup: async (id) => {
    const groups = await invoke<Group[]>("delete_group", { id });
    set({ groups, activeGroupId: "all" });
  },

  setItemGroup: async (itemId, groupId) => {
    const raw = await invoke<Record<string, unknown>[]>("set_item_group", {
      itemId,
      groupId: groupId ?? null,
    });
    set({ items: mapItems(raw) });
  },

  togglePin: async (id) => {
    const raw = await invoke<Record<string, unknown>[]>("toggle_pin", { id });
    set({ items: mapItems(raw) });
  },

  deleteItem: async (id) => {
    const raw = await invoke<Record<string, unknown>[]>("delete_item", { id });
    set({ items: mapItems(raw) });
  },

  clearHistory: async () => {
    const raw = await invoke<Record<string, unknown>[]>("clear_history");
    set({ items: mapItems(raw) });
  },

  pasteItem: async (id, asPlainText = false) => {
    try {
      await invoke("paste_item", { id, asPlainText });
    } catch (e) {
      console.error("Paste error", e);
    }
  },
}));

// Listen for backend-pushed history updates (clipboard watcher events)
listen<Record<string, unknown>[]>("history-updated", (event) => {
  useClipboardStore.getState().setItems(mapItems(event.payload));
});
