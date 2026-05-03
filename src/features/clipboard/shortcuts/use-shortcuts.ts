import { useEffect, useRef, RefObject } from "react";
import {
  ClipboardItem,
  Group,
} from "../../../store/use-clipboard-store";

interface UseShortcutsProps {
  displayItems: ClipboardItem[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchRef: RefObject<HTMLInputElement>;
  pasteItem: (id: string, asPlainText?: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  isAnyModalOpen: boolean;
  setIsGroupModalOpen: (open: boolean) => void;
  groups: Group[];
  activeGroupId: string;
  setActiveGroupId: (id: string) => void;
  setIsShortcutsModalOpen: (open: boolean) => void;
}

// Stash mutable values in a ref so the keydown listener installs once and
// doesn't tear down on every state change. Each handler reads the latest
// values from the ref at call time.
export function useShortcuts(props: UseShortcutsProps) {
  const propsRef = useRef(props);
  propsRef.current = props;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const p = propsRef.current;
      if (p.isAnyModalOpen) return;

      const isSearchFocused = document.activeElement === p.searchRef.current;
      const selectedIndex = p.selectedId
        ? p.displayItems.findIndex((i) => i.id === p.selectedId)
        : -1;
      const safeIndex = selectedIndex >= 0 ? selectedIndex : 0;
      const currentItem = p.displayItems[safeIndex];

      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault();
        p.setIsGroupModalOpen(true);
        return;
      }

      if (!isSearchFocused && e.key === "?") {
        e.preventDefault();
        p.setIsShortcutsModalOpen(true);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        p.searchRef.current?.focus();
        return;
      }

      if (
        ((e.metaKey || e.ctrlKey) && e.key === "p") ||
        (!isSearchFocused && e.key === "p")
      ) {
        e.preventDefault();
        if (currentItem) p.togglePin(currentItem.id);
        return;
      }

      if (e.key === "Escape" || (e.ctrlKey && e.key === "[")) {
        if (isSearchFocused) {
          p.searchRef.current?.blur();
          e.preventDefault();
        } else if (p.searchQuery) {
          p.setSearchQuery("");
          e.preventDefault();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault();
        if (currentItem) p.deleteItem(currentItem.id);
        return;
      }

      if ((e.metaKey || e.ctrlKey) && /^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const index = parseInt(e.key) - 1;
        const target = p.displayItems[index];
        if (target) p.pasteItem(target.id, e.shiftKey);
        return;
      }

      const moveSelection = (delta: number) => {
        if (p.displayItems.length === 0) return;
        const next = Math.max(
          0,
          Math.min(p.displayItems.length - 1, safeIndex + delta),
        );
        p.setSelectedId(p.displayItems[next].id);
      };

      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSelection(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection(-1);
      } else if (!isSearchFocused && e.key === "j") {
        e.preventDefault();
        moveSelection(1);
      } else if (!isSearchFocused && e.key === "k") {
        e.preventDefault();
        moveSelection(-1);
      } else if (!isSearchFocused && e.key === "h") {
        e.preventDefault();
        const groupIds = ["all", ...p.groups.map((g) => g.id)];
        const currentIndex = groupIds.indexOf(p.activeGroupId);
        if (currentIndex > 0) p.setActiveGroupId(groupIds[currentIndex - 1]);
      } else if (!isSearchFocused && e.key === "l") {
        e.preventDefault();
        const groupIds = ["all", ...p.groups.map((g) => g.id)];
        const currentIndex = groupIds.indexOf(p.activeGroupId);
        if (currentIndex < groupIds.length - 1) {
          p.setActiveGroupId(groupIds[currentIndex + 1]);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentItem) p.pasteItem(currentItem.id, e.shiftKey);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
