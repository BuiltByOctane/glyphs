import { useEffect } from "react";
import { X } from "lucide-react";

interface ShortcutsModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: ["\u2318", "K"], label: "Search" },
  { keys: ["\u2318", "1-9"], label: "Quick Copy" },
  { keys: ["↑", "↓", "/", "J", "K"], label: "Item Navigation" },
  { keys: ["H", "L"], label: "Switch Group" },
  { keys: ["\u2318", "I"], label: "Manage Groups" },
  { keys: ["P"], label: "Pin Item" },
  { keys: ["\u2318", "D"], label: "Delete Item" },
  { keys: ["Enter"], label: "Copy Selected" },
  { keys: ["Esc", "/", "\u2318", "["], label: "Navigation Mode" },
  { keys: ["?"], label: "Show Shortcuts" },
];

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "[")) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="no-scrollbar min-h-0 space-y-3 overflow-y-auto p-4">
          {SHORTCUTS.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between gap-4">
              <span className="min-w-0 text-sm text-white/70">
                {shortcut.label}
              </span>
              <div className="flex flex-wrap justify-end gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-white/10 bg-white/10 px-1.5 text-xs font-medium uppercase text-white/90 shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
