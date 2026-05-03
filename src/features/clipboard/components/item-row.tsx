import { useEffect, useRef } from "react";
import {
  Pin,
  Trash2,
  Type,
  Image as ImageIcon,
  ClipboardPaste,
  QrCode,
  FolderOpen,
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { useClipboardStore, type ClipboardItem } from "../../../store/use-clipboard-store";

interface ItemRowProps {
  item: ClipboardItem;
  displayIndex: number;
  isSelected: boolean;
  onClick: () => void;
  onShowQr: (content: string) => void;
  onShowMove: (item: ClipboardItem) => void;
}

export function ItemRow({
  item,
  displayIndex,
  isSelected,
  onClick,
  onShowQr,
  onShowMove,
}: ItemRowProps) {
  const { togglePin, deleteItem, pasteItem, groups } = useClipboardStore();
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && rowRef.current) {
      rowRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected]);

  // item.content for images is a `data:image/png;base64,...` string produced
  // by the Rust watcher. Treated as trusted in CSS background-image; if that
  // ever changes (e.g. external paste), validate the data-URL prefix here.
  const imageBackground = item.type === "image"
    ? { backgroundImage: `url(${item.content})` }
    : undefined;

  return (
    <div
      ref={rowRef}
      title={item.content}
      className={cn(
        "group mx-2 mb-1.5 flex min-h-[3.25rem] cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10",
        isSelected ? "bg-white/15 text-white" : "bg-white/5 text-foreground",
      )}
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
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
        <div className="min-w-0 flex-1">
          {item.type === "text" ? (
            <span
              className={cn(
                "block truncate",
                isSelected ? "text-white" : "dark:text-white text-black",
              )}
            >
              {item.content.trim()}
            </span>
          ) : (
            <div className="h-10 w-24 rounded bg-cover bg-center" style={imageBackground} />
          )}
        </div>
      </div>

      <div className="relative flex h-8 w-[9.5rem] max-w-[45%] shrink-0 items-center justify-end">
        {displayIndex < 9 && (
          <span className="pointer-events-none absolute right-0 rounded border border-white/5 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/25 transition-opacity group-hover:opacity-0">
            {"⌘"}
            <span className="ml-1">{displayIndex + 1}</span>
          </span>
        )}
        <div
          className="pointer-events-none relative flex items-center gap-1 bg-transparent opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {groups.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowMove(item);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
              title="Move to Group"
            >
              <FolderOpen
                size={14}
                className="cursor-pointer text-black/70 dark:text-white"
              />
            </button>
          )}
          {item.type === "text" && (
            <button
              onClick={() => onShowQr(item.content)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
              title="Generate QR Code"
            >
              <QrCode
                size={14}
                className="cursor-pointer text-black/70 dark:text-white"
              />
            </button>
          )}
          <button
            onClick={() => pasteItem(item.id, true)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
            title="Paste as Plain Text"
          >
            <ClipboardPaste
              size={14}
              className="cursor-pointer text-black/70 dark:text-white"
            />
          </button>
          <button
            onClick={() => togglePin(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-black/10 dark:hover:bg-white/10"
            title="Pin Item"
          >
            <Pin
              size={14}
              className={cn(
                "cursor-pointer text-black/70 dark:text-white",
                item.isPinned && "fill-current text-black dark:text-white",
              )}
            />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 hover:bg-red-500/20"
            title="Delete Item"
          >
            <Trash2 className="text-red-400 cursor-pointer" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
