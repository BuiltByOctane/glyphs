import { useEffect, useState } from "react";
import { useClipboardStore } from "./store/use-clipboard-store";
import { SearchBar } from "./features/clipboard/components/search-bar";
import { ClipboardList } from "./features/clipboard/components/clipboard-list";

export default function App() {
  const {
    items,
    searchQuery,
    setSearchQuery,
    loadHistory,
    clearHistory,
    pasteItem,
  } = useClipboardStore();

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    if (item.type === "image") return false;
    return item.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pinnedItems = filteredItems.filter((i) => i.isPinned);
  const recentItems = filteredItems.filter((i) => !i.isPinned);
  const displayItems = [...pinnedItems, ...recentItems];

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, displayItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayItems.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (displayItems.length > 0) {
          const item = displayItems[selectedIndex];
          pasteItem(item.id, e.shiftKey);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [displayItems, selectedIndex, pasteItem]);

  return (
    <div className="flex flex-col h-screen w-screen bg-transparent rounded-2xl border-white/20 dark:border-white/10 overflow-hidden">
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showClearButton={items.length > 0}
        onClearHistory={clearHistory}
      />
      <div className=" border-t border-white/20 flex-1 overflow-y-auto py-2 no-drag">
        <ClipboardList
          items={displayItems}
          pinnedItems={pinnedItems}
          recentItems={recentItems}
          searchQuery={searchQuery}
          selectedIndex={selectedIndex}
          onPasteItem={pasteItem}
        />
      </div>
    </div>
  );
}
