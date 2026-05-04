import { Stars } from "lucide-react";
import { ClipboardItem } from "../../../store/use-clipboard-store";
import { ItemRow } from "./item-row";

interface ClipboardListProps {
  items: ClipboardItem[];
  pinnedItems: ClipboardItem[];
  recentItems: ClipboardItem[];
  searchQuery: string;
  selectedId: string | null;
  onPasteItem: (id: string) => void;
  onShowQr: (content: string) => void;
  onShowMove: (item: ClipboardItem) => void;
  onPreviewChange: (item: ClipboardItem | null, rect: DOMRect | null) => void;
}

export function ClipboardList({
  items,
  pinnedItems,
  recentItems,
  searchQuery,
  selectedId,
  onPasteItem,
  onShowQr,
  onShowMove,
  onPreviewChange,
}: ClipboardListProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 text-center text-sm text-neutral-500">
        <Stars className="mb-3" size={40} />
        {searchQuery ? "No results found." : "Clipboard history is empty."}
      </div>
    );
  }

  return (
    <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto py-2">
      {pinnedItems.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-foreground/70">
            Pinned
          </div>
          {pinnedItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              displayIndex={idx}
              isSelected={selectedId === item.id}
              onClick={() => onPasteItem(item.id)}
              onShowQr={onShowQr}
              onShowMove={onShowMove}
              onPreviewChange={onPreviewChange}
            />
          ))}
        </div>
      )}

      {recentItems.length > 0 && (
        <div>
          <div className="mb-1 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-foreground/70">
            Recent
          </div>
          {recentItems.map((item, idx) => (
            <ItemRow
              key={item.id}
              item={item}
              displayIndex={idx + pinnedItems.length}
              isSelected={selectedId === item.id}
              onClick={() => onPasteItem(item.id)}
              onShowQr={onShowQr}
              onShowMove={onShowMove}
              onPreviewChange={onPreviewChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
