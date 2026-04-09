import { useEffect, useRef } from "react";
import {
  Pin,
  Trash2,
  Type,
  Image as ImageIcon,
  ClipboardPaste,
  QrCode,
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
  onShowQr: (content: string) => void;
}

export function ItemRow({
  item,
  index,
  selectedIndex,
  onClick,
  onShowQr,
}: ItemRowProps) {
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
        "group cursor-pointer hover:bg-white/10 flex items-center justify-between rounded-lg py-1 px-2 mx-2 transition-colors text-sm mb-1.5",
        isSelected ? "bg-white/15 text-white" : "bg-white/5 text-foreground",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3 overflow-hidden py-2 px-3">
        {item.type === "text" ? (
          <Type
            size={16}
            className={cn(
              "opacity-50 shrink-0",
              isSelected ? "text-white" : "dark:text-white text-black",
            )}
          />
        ) : (
          <ImageIcon
            size={16}
            className={cn(
              "opacity-50 shrink-0",
              isSelected ? "text-white" : "dark:text-white text-black",
            )}
          />
        )}
        <div className="truncate flex-1 max-w-400">
          {item.type === "text" ? (
            <span
              className={cn(
                "whitespace-pre-wrap line-clamp-1",
                isSelected ? "text-white" : "dark:text-white text-black",
              )}
            >
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

      <div className="relative flex items-center justify-end min-w-32 shrink-0">
        {index < 9 && (
          <span className="text-[10px] font-medium text-white/20 px-1.5 py-0.5 rounded border border-white/5 bg-white/10 group-hover:opacity-0 transition-opacity absolute right-0 pointer-events-none">
            {"\u2318"}
            <span className="ml-1">{index + 1}</span>
          </span>
        )}
        <div
          className={cn(
            "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-transparent px-1",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {item.type === "text" && (
            <button
              onClick={() => onShowQr(item.content)}
              className="p-1 rounded-sm hover:bg-black/10 dark:hover:bg-white/10"
              title="Generate QR Code"
            >
              <QrCode size={14} className="text-white cursor-pointer" />
            </button>
          )}
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
            title="Pin Item"
          >
            <Pin
              size={14}
              className={`cursor-pointer ${item.isPinned ? "fill-current text-white" : "text-white"}`}
            />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            className="p-1 rounded-sm hover:bg-red-500/20 text-red-500"
            title="Delete Item"
          >
            <Trash2 className="text-red-400 cursor-pointer" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
