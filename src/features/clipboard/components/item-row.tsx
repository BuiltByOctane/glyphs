import { useEffect, useRef, useState } from "react";
import {
  Pin,
  Trash2,
  Type,
  Image as ImageIcon,
  ClipboardPaste,
  QrCode,
  FolderOpen,
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
  const { togglePin, deleteItem, pasteItem, groups, setItemGroup } =
    useClipboardStore();
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
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
      onMouseLeave={() => setIsGroupMenuOpen(false)}
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
            <div
              className="h-10 w-24 rounded bg-cover bg-center"
              style={{ backgroundImage: `url(${item.content})` }}
            />
          )}
        </div>
      </div>

      <div className="relative flex h-8 w-[9.5rem] max-w-[45%] shrink-0 items-center justify-end">
        {index < 9 && (
          <span className="pointer-events-none absolute right-0 rounded border border-white/5 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/25 transition-opacity group-hover:opacity-0">
            {"\u2318"}
            <span className="ml-1">{index + 1}</span>
          </span>
        )}
        <div
          className={cn(
            "relative flex items-center gap-1 bg-transparent transition-opacity",
            isGroupMenuOpen
              ? "opacity-100"
              : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {groups.length > 0 && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGroupMenuOpen(!isGroupMenuOpen);
                }}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                  isGroupMenuOpen
                    ? "bg-white/20 text-white"
                    : "hover:bg-black/10 dark:hover:bg-white/10",
                )}
                title="Move to Group"
              >
                <FolderOpen
                  size={14}
                  className="cursor-pointer text-black/70 dark:text-white"
                />
              </button>
              {isGroupMenuOpen && (
                <div className="absolute -bottom-10 right-10 z-100 mb-2 max-h-48 w-40 overflow-y-auto rounded-lg border border-white/10 bg-neutral-800 py-1 shadow-xl">
                  <button
                    className="w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/10"
                    onClick={() => {
                      setItemGroup(item.id, undefined);
                      setIsGroupMenuOpen(false);
                    }}
                  >
                    All
                  </button>
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      className={cn(
                        "w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 flex items-center gap-2",
                        item.groupId === g.id && "bg-white/5",
                      )}
                      onClick={() => {
                        setItemGroup(item.id, g.id);
                        setIsGroupMenuOpen(false);
                      }}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
