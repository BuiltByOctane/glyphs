/// <reference types="vite/client" />

type GlyphClipboardItemType = "text" | "image";

interface GlyphClipboardItem {
  id: string;
  type: GlyphClipboardItemType;
  content: string;
  timestamp: number;
  isPinned: boolean;
  groupId?: string;
}

interface GlyphGroup {
  id: string;
  name: string;
  icon: string;
}

interface Window {
  ipcRenderer: {
    getHistory: () => Promise<GlyphClipboardItem[]>;
    togglePin: (id: string) => Promise<GlyphClipboardItem[]>;
    deleteItem: (id: string) => Promise<GlyphClipboardItem[]>;
    clearHistory: () => Promise<GlyphClipboardItem[]>;
    pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
    onHistoryUpdated: (callback: (data: GlyphClipboardItem[]) => void) => void;
    getGroups: () => Promise<GlyphGroup[]>;
    addGroup: (group: GlyphGroup) => Promise<GlyphGroup[]>;
    updateGroup: (group: GlyphGroup) => Promise<GlyphGroup[]>;
    deleteGroup: (id: string) => Promise<GlyphGroup[]>;
    setItemGroup: (
      itemId: string,
      groupId?: string,
    ) => Promise<GlyphClipboardItem[]>;
  };
}
