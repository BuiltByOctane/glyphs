import Store from "electron-store";

export type ClipboardItemType = "text" | "image";

export interface ClipboardItem {
  id: string;
  type: ClipboardItemType;
  content: string;
  timestamp: number;
  isPinned: boolean;
}

interface StoreSchema {
  history: ClipboardItem[];
  settings: {
    maxHistorySize: number;
  };
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
  },
});

export default store;
