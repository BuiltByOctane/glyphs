import { useRef, useEffect } from "react";
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
    if (e.detail === 2) {
      onEditGroup(group);
    } else {
      setActiveGroupId(group.id);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeElement = container.querySelector('[data-active="true"]') as HTMLElement;
    if (activeElement) {
      const containerWidth = container.offsetWidth;
      const elementOffset = activeElement.offsetLeft;
      const elementWidth = activeElement.offsetWidth;

      const scrollTarget = elementOffset - (containerWidth / 2) + (elementWidth / 2);
      
      container.scrollTo({
        left: scrollTarget,
        behavior: "smooth"
      });
    }
  }, [activeGroupId]);

  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/10 px-3">
      <div
        className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        ref={scrollRef}
      >
        <button
          onClick={() => setActiveGroupId("all")}
          data-active={activeGroupId === "all"}
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
              data-active={activeGroupId === group.id}
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
