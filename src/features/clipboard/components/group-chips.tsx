import { useRef } from "react";
import type { ComponentType } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useClipboardStore, Group } from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

type ChipIcon = ComponentType<{ size?: number; className?: string }>;
const iconMap = LucideIcons as unknown as Record<string, ChipIcon>;

interface GroupChipsProps {
  onAddGroup: () => void;
  onEditGroup: (group: Group) => void;
}

export function GroupChips({ onAddGroup, onEditGroup }: GroupChipsProps) {
  const { groups, activeGroupId, setActiveGroupId } = useClipboardStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleGroupClick = (e: React.MouseEvent, group: Group) => {
    // If they double click or right click, open edit? Let's just use double click.
    if (e.detail === 2) {
      onEditGroup(group);
    } else {
      setActiveGroupId(group.id);
    }
  };

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/10 px-3">
      <div
        className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        ref={scrollRef}
      >
        <button
          onClick={() => setActiveGroupId("all")}
          className={cn(
            "flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
            activeGroupId === "all"
              ? "bg-white/20 text-white"
              : "bg-white/5 text-white/60 hover:bg-white/10",
          )}
        >
          <LayoutGrid size={14} />
          All
        </button>

        {groups.map((group) => {
          const Icon = iconMap[group.icon] || LucideIcons.Folder;
          return (
            <button
              key={group.id}
              onClick={(e) => handleGroupClick(e, group)}
              onContextMenu={(e) => {
                e.preventDefault();
                onEditGroup(group);
              }}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-xs font-medium transition-colors",
                activeGroupId === group.id
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10",
              )}
              title="Double-click or Right-click to edit"
            >
              <Icon size={14} />
              {group.name}
            </button>
          );
        })}
      </div>

      <button
        onClick={onAddGroup}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
        title="Create Group"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
