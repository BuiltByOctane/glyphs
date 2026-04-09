import { useEffect, RefObject } from "react";
import { ClipboardItem } from "../../../store/use-clipboard-store";

interface UseShortcutsProps {
  displayItems: ClipboardItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number | ((prev: number) => number)) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchRef: RefObject<HTMLInputElement>;
  pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
}

export function useShortcuts({
  displayItems,
  selectedIndex,
  setSelectedIndex,
  searchQuery,
  setSearchQuery,
  searchRef,
  pasteItem,
  deleteItem,
  togglePin,
}: UseShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isSearchFocused = document.activeElement === searchRef.current;

      // cmd + k: focus search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Pin selected (p in nav mode or cmd+p)
      if (
        ((e.metaKey || e.ctrlKey) && e.key === "p") ||
        (!isSearchFocused && e.key === "p")
      ) {
        e.preventDefault();
        if (displayItems.length > 0) {
          togglePin(displayItems[selectedIndex].id);
        }
        return;
      }

      // Esc or Ctrl + [: enter navigation mode (blur search) or clear query
      if (e.key === "Escape" || (e.ctrlKey && e.key === "[")) {
        if (isSearchFocused) {
          searchRef.current?.blur();
          e.preventDefault();
        } else if (searchQuery) {
          setSearchQuery("");
          e.preventDefault();
        }
        return;
      }

      // cmd + d: delete selected
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (displayItems.length > 0) {
          deleteItem(displayItems[selectedIndex].id);
        }
        return;
      }

      // cmd + 1-9: copy nth item
      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        if (index < displayItems.length) {
          pasteItem(displayItems[index].id, e.shiftKey);
        }
        return;
      }

      // arrow navigation
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayItems.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
      // vim navigation (only when search is not focused)
      else if (!isSearchFocused && e.key === "j") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < displayItems.length - 1 ? prev + 1 : prev,
        );
      } else if (!isSearchFocused && e.key === "k") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
      // enter to paste
      else if (e.key === "Enter") {
        e.preventDefault();
        if (displayItems.length > 0) {
          const item = displayItems[selectedIndex];
          pasteItem(item.id, e.shiftKey);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    displayItems,
    selectedIndex,
    setSelectedIndex,
    searchQuery,
    setSearchQuery,
    searchRef,
    pasteItem,
    deleteItem,
    togglePin,
  ]);
}
