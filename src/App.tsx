import { useEffect, useMemo, useState, useRef } from "react";
import {
  type ClipboardItem,
  type Group,
  subscribeToBackend,
  useClipboardStore,
} from "./store/use-clipboard-store";
import { SearchBar } from "./features/clipboard/components/search-bar";
import { ClipboardList } from "./features/clipboard/components/clipboard-list";
import { GroupChips } from "./features/clipboard/components/group-chips";
import { GroupModal } from "./features/clipboard/components/group-modal";
import { MoveCategoryModal } from "./features/clipboard/components/move-category-modal";

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

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [moveModalItem, setMoveModalItem] = useState<ClipboardItem | null>(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<Group | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Register backend listeners first, then load initial data — this avoids the
  // startup race where a clipboard event fires before the listener is bound.
  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    (async () => {
      const unsubscribe = await subscribeToBackend();
      if (cancelled) {
        unsubscribe();
        return;
      }
      cleanup = unsubscribe;
      await Promise.all([loadHistory(), loadGroups()]);
    })();
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [loadHistory, loadGroups]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (activeGroupId !== "all" && item.groupId !== activeGroupId) return false;
        if (!searchQuery) return true;
        if (item.type === "image") return false;
        return item.content.toLowerCase().includes(searchQuery.toLowerCase());
      }),
    [items, activeGroupId, searchQuery],
  );

  const pinnedItems = useMemo(
    () => filteredItems.filter((i) => i.isPinned),
    [filteredItems],
  );
  const recentItems = useMemo(
    () => filteredItems.filter((i) => !i.isPinned),
    [filteredItems],
  );
  const displayItems = useMemo(
    () => [...pinnedItems, ...recentItems],
    [pinnedItems, recentItems],
  );

  // If the previously-selected item leaves the visible set (filtered out,
  // deleted, etc.) snap back to the first item.
  useEffect(() => {
    if (displayItems.length === 0) {
      if (selectedId !== null) setSelectedId(null);
      return;
    }
    if (!selectedId || !displayItems.some((i) => i.id === selectedId)) {
      setSelectedId(displayItems[0].id);
    }
  }, [displayItems, selectedId]);

  const isAnyModalOpen =
    isGroupModalOpen ||
    isShortcutsModalOpen ||
    qrContent !== null ||
    moveModalItem !== null;

  useShortcuts({
    displayItems,
    selectedId,
    setSelectedId,
    searchQuery,
    setSearchQuery,
    searchRef,
    pasteItem,
    deleteItem,
    togglePin,
    isAnyModalOpen,
    setIsGroupModalOpen,
    groups,
    activeGroupId,
    setActiveGroupId,
    setIsShortcutsModalOpen,
  });

  return (
    <div data-tauri-drag-region className="flex h-screen w-screen flex-col overflow-hidden rounded-2xl border border-white/20 bg-transparent text-foreground dark:border-white/10">
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
          selectedId={selectedId}
          onPasteItem={pasteItem}
          onShowQr={setQrContent}
          onShowMove={setMoveModalItem}
        />
      </div>

      <Footer onOpenShortcuts={() => setIsShortcutsModalOpen(true)} />

      {qrContent && (
        <QrModal content={qrContent} onClose={() => setQrContent(null)} />
      )}
      {moveModalItem && (
        <MoveCategoryModal
          item={moveModalItem}
          onClose={() => setMoveModalItem(null)}
        />
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
