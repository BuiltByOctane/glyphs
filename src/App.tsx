import { useEffect, useState, useRef } from "react";
import { useClipboardStore } from "./store/use-clipboard-store";
import { SearchBar } from "./features/clipboard/components/search-bar";
import { ClipboardList } from "./features/clipboard/components/clipboard-list";

import { Footer } from "./features/clipboard/components/footer";
import { useShortcuts } from "./features/clipboard/shortcuts/use-shortcuts";

export default function App() {
  const {
    items,
    searchQuery,
    setSearchQuery,
    loadHistory,
    clearHistory,
    pasteItem,
    deleteItem,
    togglePin,
  } = useClipboardStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

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

  useShortcuts({
    displayItems,
    selectedIndex,
    setSelectedIndex,
    searchQuery,
    setSearchQuery,
    searchRef,
    pasteItem,
    deleteItem,
    togglePin,
  });

  return (
    <div className="flex flex-col h-screen w-screen bg-transparent rounded-2xl border-white/20 dark:border-white/10 overflow-hidden">
      <SearchBar
        ref={searchRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showClearButton={items.length > 0}
        onClearHistory={clearHistory}
      />
      <div className="border-t border-white/20 flex-1 overflow-y-auto py-2 no-drag">
        <ClipboardList
          items={displayItems}
          pinnedItems={pinnedItems}
          recentItems={recentItems}
          searchQuery={searchQuery}
          selectedIndex={selectedIndex}
          onPasteItem={pasteItem}
        />
      </div>
      <Footer />
    </div>
  );
}
