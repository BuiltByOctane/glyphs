import { useRef } from "react";
import { Plus, LayoutGrid } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useClipboardStore, Group } from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

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
    <div className="flex items-center border-t-1 border-white/20 gap-1 px-3 py-2 min-h-12 max-h-12 overflow-x-auto no-scrollbar" ref={scrollRef}>
      <button
        onClick={() => setActiveGroupId("all")}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
          activeGroupId === "all" ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
        )}
      >
        <LayoutGrid size={14} />
        All
      </button>

      {groups.map((group) => {
        // @ts-ignore
        const Icon = LucideIcons[group.icon] || LucideIcons.Folder;
        return (
          <button
            key={group.id}
            onClick={(e) => handleGroupClick(e, group)}
            onContextMenu={(e) => {
              e.preventDefault();
              onEditGroup(group);
            }}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              activeGroupId === group.id ? "bg-white/20 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"
            )}
            title="Double-click or Right-click to edit"
          >
            <Icon size={14} />
            {group.name}
          </button>
        );
      })}

      <div className="ml-auto flex shrink-0">
        <button
          onClick={onAddGroup}
          className="p-1.5 ml-2 rounded-full bg-white/5 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
          title="Create Group"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
