import { useEffect, useRef } from "react";
import {
  Pin,
  Trash2,
  Type,
  Image as ImageIcon,
  ClipboardPaste,
} from "lucide-react";
import {
  useClipboardStore,
  ClipboardItem,
} from "../../../store/use-clipboard-store";
import { cn } from "../../../lib/utils";

interface ItemRowProps {
  item: ClipboardItem;
  index: number;
  selectedIndex: number;
  onClick: () => void;
}

export function ItemRow({ item, index, selectedIndex, onClick }: ItemRowProps) {
  const { togglePin, deleteItem, pasteItem } = useClipboardStore();
  const isSelected = index === selectedIndex;
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "group cursor-pointer bg-white/5 hover:bg-white/10 flex items-center justify-between rounded-lg py-1 px-2 mx-2 transition-colors text-sm mb-1.5",
        isSelected ? "text-primary-foreground" : "text-foreground",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 overflow-hidden py-2 px-3">
        {item.type === "text" ? (
          <Type
            size={16}
            className="opacity-50 shrink-0 dark:text-white text-black"
          />
        ) : (
          <ImageIcon
            size={16}
            className="opacity-50 shrink-0 dark:text-white text-black"
          />
        )}
        <div className="truncate flex-1 max-w-400">
          {item.type === "text" ? (
            <span className="whitespace-pre-wrap dark:text-white text-black line-clamp-1">
              {item.content.trim()}
            </span>
          ) : (
            <div
              className="h-10 w-24 bg-cover bg-center rounded-sm"
              style={{ backgroundImage: `url(${item.content})` }}
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => pasteItem(item.id, true)}
          className="p-1 rounded-sm hover:bg-black/10 dark:hover:bg-white/10"
          title="Paste as Plain Text"
        >
          <ClipboardPaste size={14} className="text-white cursor-pointer" />
        </button>
        <button
          onClick={() => togglePin(item.id)}
          className="p-1 rounded-sm hover:bg-black/10 dark:hover:bg-white/10"
        >
          <Pin
            size={14}
            className={`cursor-pointer ${item.isPinned ? "fill-current text-white" : "text-white"}`}
          />
        </button>
        <button
          onClick={() => deleteItem(item.id)}
          className="p-1 rounded-sm hover:bg-red-500/20 text-red-500"
        >
          <Trash2 className="text-red-400 cursor-pointer" size={14} />
        </button>
      </div>
    </div>
  );
}
