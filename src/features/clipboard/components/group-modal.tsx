import { useState, useEffect } from "react";
import type { ComponentType } from "react";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useClipboardStore, Group } from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

const ICONS = [
  "Folder",
  "Star",
  "Bookmark",
  "Briefcase",
  "Code",
  "Terminal",
  "Heart",
  "List",
  "Hash",
  "Layers",
  "Inbox",
  "Globe",
  "Cloud",
  "Box",
  "Cpu",
];

type ModalIcon = ComponentType<{ size?: number; className?: string }>;
const iconMap = LucideIcons as unknown as Record<string, ModalIcon>;

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
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 24) return;
    if (editGroup) {
      updateGroup({ ...editGroup, name: trimmed, icon });
    } else {
      addGroup({ id: uuidv4(), name: trimmed, icon });
    }
    onClose();
  };

  const handleDelete = () => {
    if (editGroup) {
      deleteGroup(editGroup.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center rounded-2xl justify-center p-4">
      <div className="flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-regular text-white">
            {editGroup ? "Edit Group" : "Create New Group"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="min-h-0 space-y-4 overflow-y-auto p-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Name
            </label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              minLength={2}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="e.g. Work, Ideas, Snippets..."
              className="w-full rounded-md border mt-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mediuim text-white/70 uppercase tracking-wider">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-2 mt-2">
              {ICONS.map((iconName) => {
                const IconComponent = iconMap[iconName] || LucideIcons.Folder;
                return (
                  <button
                    key={iconName}
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      "flex h-9 items-center justify-center rounded-md transition-all",
                      icon === iconName
                        ? "bg-white/20 text-white shadow-sm ring-0"
                        : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80",
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

        <div className="p-4 border-t border-white/10 flex items-center justify-between">
          {editGroup ? (
            <button
              onClick={handleDelete}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-red-500/5 px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              Delete
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            disabled={name.trim().length < 2 || name.trim().length > 24}
            className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50 cursor-pointer"
          >
            {editGroup ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
