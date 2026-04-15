import { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useClipboardStore, Group } from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

const ICONS = [
  "Folder", "Star", "Bookmark", "Briefcase", "Code",
  "Terminal", "Heart", "List", "Hash", "Layers",
  "Inbox", "Globe", "Cloud", "Box", "Cpu"
];

interface GroupModalProps {
  onClose: () => void;
  editGroup?: Group | null;
}

export function GroupModal({ onClose, editGroup }: GroupModalProps) {
  const [name, setName] = useState(editGroup?.name || "");
  const [icon, setIcon] = useState(editGroup?.icon || "Folder");
  const { addGroup, updateGroup, deleteGroup } = useClipboardStore();

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

  const handleSave = () => {
    if (!name.trim()) return;
    if (editGroup) {
      updateGroup({ ...editGroup, name: name.trim(), icon });
    } else {
      addGroup({ id: uuidv4(), name: name.trim(), icon });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editGroup) {
      deleteGroup(editGroup.id);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">
            {editGroup ? "Edit Group" : "Create New Group"}
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Name</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="e.g. Work, Ideas, Snippets..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {ICONS.map((iconName) => {
                // @ts-ignore
                const IconComponent = LucideIcons[iconName] || LucideIcons.Folder;
                return (
                  <button
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      "p-2 rounded-lg flex items-center justify-center transition-all",
                      icon === iconName ? "bg-white/20 text-white shadow-sm ring-1 ring-white/50" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80"
                    )}
                    title={iconName}
                  >
                    <IconComponent size={18} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/5">
          {editGroup ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-400 px-4 py-1.5 rounded-lg hover:bg-red-500/10 bg-red-500/5 cursor-pointer transition-colors"
            >
              Delete
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center justify-center gap-1.5 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
          >
            {editGroup ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
