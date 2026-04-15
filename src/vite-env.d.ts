/// <reference types="vite/client" />

interface Window {
  ipcRenderer: {
    getHistory: () => Promise<any[]>;
    togglePin: (id: string) => Promise<any[]>;
    deleteItem: (id: string) => Promise<any[]>;
    clearHistory: () => Promise<any[]>;
    pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
    onHistoryUpdated: (callback: (data: any) => void) => void;
    getGroups: () => Promise<any[]>;
    addGroup: (group: any) => Promise<any[]>;
    updateGroup: (group: any) => Promise<any[]>;
    deleteGroup: (id: string) => Promise<any[]>;
    setItemGroup: (itemId: string, groupId?: string) => Promise<any[]>;
  };
}
