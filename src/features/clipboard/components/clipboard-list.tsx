import { BrushCleaning } from "lucide-react";
import { ClipboardItem } from "../../../store/use-clipboard-store";
import { ItemRow } from "./item-row";

interface ClipboardListProps {
  items: ClipboardItem[];
  pinnedItems: ClipboardItem[];
  recentItems: ClipboardItem[];
  searchQuery: string;
  selectedIndex: number;
  onPasteItem: (id: string) => void;
  onShowQr: (content: string) => void;
}

export function ClipboardList({
  items,
  pinnedItems,
  recentItems,
  searchQuery,
  selectedIndex,
  onPasteItem,
  onShowQr,
}: ClipboardListProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-sm">
        <BrushCleaning className="mb-3" size={40} />
        {searchQuery ? "No results found." : "Clipboard history is empty."}
      </div>
    );
  }

  return (
    <>
      {pinnedItems.length > 0 && (
        <div className="mb-2">
          <div className="px-4 py-1 text-xs font-semibold dark:text-white/70 text-black uppercase tracking-wider mb-1">
            Pinned
          </div>
          {pinnedItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              index={idx}
              selectedIndex={selectedIndex}
              onClick={() => onPasteItem(item.id)}
              onShowQr={onShowQr}
            />
          ))}
        </div>
      )}

      {recentItems.length > 0 && (
        <div>
          <div className="px-4 py-1 text-xs font-semibold dark:text-white/70 text-black uppercase tracking-wider mb-1">
            Recent
          </div>
          {recentItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              index={idx + pinnedItems.length}
              selectedIndex={selectedIndex}
              onClick={() => onPasteItem(item.id)}
              onShowQr={onShowQr}
            />
          ))}
        </div>
      )}
    </>
  );
}
