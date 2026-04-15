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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[95%]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Keyboard Shortcuts</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1 cursor-pointer transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-3 overflow-y-scroll no-scrollbar">
          {SHORTCUTS.map((shortcut, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-sm text-white/70">{shortcut.label}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="min-w-[1.5rem] h-6 px-1.5 flex items-center justify-center rounded bg-white/10 border border-white/10 text-xs font-medium text-white/90 uppercase shadow-sm"
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
