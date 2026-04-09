/// <reference types="vite/client" />

interface Window {
  ipcRenderer: {
    getHistory: () => Promise<any[]>;
    togglePin: (id: string) => Promise<any[]>;
    deleteItem: (id: string) => Promise<any[]>;
    clearHistory: () => Promise<any[]>;
    pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
    onHistoryUpdated: (callback: (data: any) => void) => void;
  };
}
