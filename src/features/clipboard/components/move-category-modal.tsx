import { useEffect } from "react";
import { X, FolderOpen, LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";
import {
  useClipboardStore,
  ClipboardItem,
} from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

type ChipIcon = ComponentType<{ size?: number; className?: string }>;
const iconMap = LucideIcons as unknown as Record<string, ChipIcon>;

interface MoveCategoryModalProps {
  item: ClipboardItem;
  onClose: () => void;
}

export function MoveCategoryModal({ item, onClose }: MoveCategoryModalProps) {
  const { groups, setItemGroup } = useClipboardStore();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleEsc, { capture: true });
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex w-full items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 rounded-2xl"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="relative flex max-h-[calc(100vh-4rem)] w-full max-w-sm flex-col overflow-hidden rounded-lg bg-background border border-foreground/10 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
          <h2 className="text-sm font-medium text-foreground flex items-center gap-2">
            <FolderOpen size={16} className="text-foreground/70" />
            Move to Category
          </h2>
          <button
            onClick={onClose}
            className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-foreground/50 transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <button
            className={cn(
              "w-full text-left px-3 py-2.5 text-sm rounded-md text-foreground transition-colors hover:bg-foreground/10 flex items-center gap-3",
              !item.groupId && "bg-foreground/10"
            )}
            onClick={() => {
              setItemGroup(item.id, undefined);
              onClose();
            }}
          >
            <LayoutGrid size={16} className="text-foreground/70" />
            All
          </button>

          {groups.map((g) => {
            const Icon = iconMap[g.icon] || LucideIcons.Folder;
            return (
              <button
                key={g.id}
                className={cn(
                  "w-full text-left px-3 py-2.5 text-sm rounded-md text-foreground transition-colors hover:bg-foreground/10 flex items-center gap-3 mt-1",
                  item.groupId === g.id && "bg-foreground/10"
                )}
                onClick={() => {
                  setItemGroup(item.id, g.id);
                  onClose();
                }}
              >
                <Icon size={16} className="text-foreground/70" />
                {g.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
