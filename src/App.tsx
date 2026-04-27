import { useEffect, useState, useRef } from "react";
import { type Group, useClipboardStore } from "./store/use-clipboard-store";
import { SearchBar } from "./features/clipboard/components/search-bar";
import { ClipboardList } from "./features/clipboard/components/clipboard-list";
import { GroupChips } from "./features/clipboard/components/group-chips";
import { GroupModal } from "./features/clipboard/components/group-modal";

import { Footer } from "./features/clipboard/components/footer";
import { useShortcuts } from "./features/clipboard/shortcuts/use-shortcuts";
import { QrModal } from "./features/clipboard/components/qr-modal";
import { ShortcutsModal } from "./features/clipboard/components/shortcuts-modal";

export default function App() {
  const {
    items,
    groups,
    activeGroupId,
    setActiveGroupId,
    searchQuery,
    setSearchQuery,
    loadHistory,
    loadGroups,
    clearHistory,
    pasteItem,
    deleteItem,
    togglePin,
  } = useClipboardStore();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHistory();
    loadGroups();
  }, [loadHistory, loadGroups]);

  const filteredItems = items.filter((item) => {
    if (activeGroupId !== "all" && item.groupId !== activeGroupId) return false;
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
    isGroupModalOpen,
    setIsGroupModalOpen,
    groups,
    activeGroupId,
    setActiveGroupId,
    isShortcutsModalOpen,
    setIsShortcutsModalOpen,
  });

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden rounded-2xl border border-white/20 bg-transparent text-foreground dark:border-white/10">
      <div className="no-drag flex min-h-0 flex-1 flex-col overflow-hidden border-t border-white/20">
        <SearchBar
          ref={searchRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showClearButton={items.length > 0}
          onClearHistory={clearHistory}
        />

        <GroupChips
          onAddGroup={() => {
            setEditGroup(null);
            setIsGroupModalOpen(true);
          }}
          onEditGroup={(group) => {
            setEditGroup(group);
            setIsGroupModalOpen(true);
          }}
        />
        <ClipboardList
          items={displayItems}
          pinnedItems={pinnedItems}
          recentItems={recentItems}
          searchQuery={searchQuery}
          selectedIndex={selectedIndex}
          onPasteItem={pasteItem}
          onShowQr={setQrContent}
        />
      </div>

      <Footer onOpenShortcuts={() => setIsShortcutsModalOpen(true)} />

      {qrContent && (
        <QrModal content={qrContent} onClose={() => setQrContent(null)} />
      )}
      {isGroupModalOpen && (
        <GroupModal
          editGroup={editGroup}
          onClose={() => {
            setIsGroupModalOpen(false);
            setEditGroup(null);
          }}
        />
      )}
      {isShortcutsModalOpen && (
        <ShortcutsModal onClose={() => setIsShortcutsModalOpen(false)} />
      )}
    </div>
  );
}
