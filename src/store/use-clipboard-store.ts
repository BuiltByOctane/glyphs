import { create } from "zustand";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

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

function mapItem(raw: Record<string, unknown>): ClipboardItem {
  return {
    id: raw.id as string,
    type: raw.type as "text" | "image",
    content: raw.content as string,
    timestamp: raw.timestamp as number,
    isPinned: raw.isPinned as boolean,
    groupId: raw.groupId as string | undefined,
  };
}

function mapItems(raws: unknown): ClipboardItem[] {
  if (!Array.isArray(raws)) return [];
  return raws.map(mapItem);
}

async function safeInvoke<T>(cmd: string, args?: Record<string, unknown>): Promise<T | null> {
  try {
    return await invoke<T>(cmd, args);
  } catch (e) {
    console.error(`invoke ${cmd} failed:`, e);
    return null;
  }
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
    const raw = await safeInvoke<unknown>("get_history");
    if (raw !== null) set({ items: mapItems(raw) });
  },

  loadGroups: async () => {
    const groups = await safeInvoke<Group[]>("get_groups");
    if (groups !== null) set({ groups });
  },

  addGroup: async (group) => {
    const groups = await safeInvoke<Group[]>("add_group", { group });
    if (groups !== null) set({ groups });
  },

  updateGroup: async (group) => {
    const groups = await safeInvoke<Group[]>("update_group", { group });
    if (groups !== null) set({ groups });
  },

  deleteGroup: async (id) => {
    const groups = await safeInvoke<Group[]>("delete_group", { id });
    if (groups !== null) set({ groups, activeGroupId: "all" });
  },

  setItemGroup: async (itemId, groupId) => {
    const raw = await safeInvoke<unknown>("set_item_group", {
      itemId,
      groupId: groupId ?? null,
    });
    if (raw !== null) set({ items: mapItems(raw) });
  },

  togglePin: async (id) => {
    const raw = await safeInvoke<unknown>("toggle_pin", { id });
    if (raw !== null) set({ items: mapItems(raw) });
  },

  deleteItem: async (id) => {
    const raw = await safeInvoke<unknown>("delete_item", { id });
    if (raw !== null) set({ items: mapItems(raw) });
  },

  clearHistory: async () => {
    const raw = await safeInvoke<unknown>("clear_history");
    if (raw !== null) set({ items: mapItems(raw) });
  },

  pasteItem: async (id, asPlainText = false) => {
    await safeInvoke("paste_item", { id, asPlainText });
  },
}));

// Subscribes the Zustand store to backend-pushed events. Returns a cleanup
// function that unlistens both subscriptions. Call this from a component
// useEffect so HMR / StrictMode don't accumulate listeners.
export async function subscribeToBackend(): Promise<() => void> {
  const unlistenHistory: UnlistenFn = await listen<unknown>(
    "history-updated",
    (event) => {
      useClipboardStore.getState().setItems(mapItems(event.payload));
    },
  );
  const unlistenGroups: UnlistenFn = await listen<Group[]>(
    "groups-updated",
    (event) => {
      if (Array.isArray(event.payload)) {
        useClipboardStore.getState().setGroups(event.payload);
      }
    },
  );
  return () => {
    unlistenHistory();
    unlistenGroups();
  };
}
