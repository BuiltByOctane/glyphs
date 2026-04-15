import Store from "electron-store";

export type ClipboardItemType = "text" | "image";

export interface Group {
  id: string;
  name: string;
  icon: string;
}

export interface ClipboardItem {
  id: string;
  type: ClipboardItemType;
  content: string;
  timestamp: number;
  isPinned: boolean;
  groupId?: string;
}

interface StoreSchema {
  history: ClipboardItem[];
  settings: {
    maxHistorySize: number;
  };
  groups: Group[];
}

const store = new Store<StoreSchema>({
  schema: {
    history: {
      type: "array",
      default: [],
    },
    settings: {
      type: "object",
      default: {
        maxHistorySize: 100,
      },
      properties: {
        maxHistorySize: {
          type: "number",
        },
      },
    },
    groups: {
      type: "array",
      default: [],
    },
  },
});

export default store;
