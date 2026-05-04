import { useEffect } from "react";
import { X } from "lucide-react";
import { Kbd } from "../../../components/kbd";

interface ShortcutsModalProps {
  onClose: () => void;
}

interface ShortcutEntry {
  keys: string[];
  label: string;
}

interface Section {
  title: string;
  entries: ShortcutEntry[];
}

const SECTIONS: Section[] = [
  {
    title: "Search & paste",
    entries: [
      { keys: ["⌘", "K"], label: "Focus search" },
      { keys: ["⌘", "1-9"], label: "Quick paste item" },
      { keys: ["↵"], label: "Paste selected" },
      { keys: ["⇧", "↵"], label: "Paste as plain text" },
    ],
  },
  {
    title: "Navigation",
    entries: [
      { keys: ["↑", "↓"], label: "Move selection" },
      { keys: ["J", "K"], label: "Move selection (vim)" },
      { keys: ["H", "L"], label: "Switch group" },
      { keys: ["Esc"], label: "Exit search / clear query" },
    ],
  },
  {
    title: "Actions",
    entries: [
      { keys: ["P"], label: "Pin / unpin selected" },
      { keys: ["⌘", "D"], label: "Delete selected" },
      { keys: ["⌘", "G"], label: "Create new group" },
      { keys: ["?"], label: "Show this dialog" },
      { keys: ["⌘", ","], label: "Open settings" },
    ],
  },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center rounded-2xl bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-xl border border-foreground/10 bg-background/80 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex h-11 shrink-0 items-center justify-between border-b border-foreground/10 px-4">
          <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        <div className="no-scrollbar min-h-0 overflow-y-auto p-4">
          {SECTIONS.map((section, idx) => (
            <div key={section.title} className={idx === 0 ? "" : "mt-5"}>
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
                {section.title}
              </div>
              <div className="divide-y divide-foreground/5">
                {section.entries.map((entry) => (
                  <div
                    key={entry.label}
                    className="flex items-center justify-between gap-4 py-2"
                  >
                    <span className="text-sm text-foreground/80">{entry.label}</span>
                    <div className="flex items-center gap-1">
                      {entry.keys.map((k, i) => (
                        <Kbd key={i}>{k}</Kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
