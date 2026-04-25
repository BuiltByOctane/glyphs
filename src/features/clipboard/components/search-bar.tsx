import { forwardRef, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { cn } from "../../../lib/utils";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showClearButton: boolean;
  onClearHistory: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ searchQuery, setSearchQuery, showClearButton, onClearHistory }, ref) => {
    const [isConfirming, setIsConfirming] = useState(false);

    // Auto-reset confirmation state after a timeout
    useEffect(() => {
      if (isConfirming) {
        const timer = setTimeout(() => setIsConfirming(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isConfirming]);

    const handleClearClick = () => {
      if (isConfirming) {
        onClearHistory();
        setIsConfirming(false);
      } else {
        setIsConfirming(true);
      }
    };

    return (
      <div className="window-drag z-10 flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
        <Search
          size={20}
          className="no-drag shrink-0 text-black/60 dark:text-white/80"
        />
        <input
          ref={ref}
          autoFocus
          className="no-drag min-w-0 flex-1 border-none bg-transparent px-1 py-1 text-sm text-black outline-none placeholder:text-black/40 dark:text-slate-200 dark:placeholder:text-white/45"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {showClearButton && (
          <button
            onClick={handleClearClick}
            className={cn(
              "no-drag h-7 shrink-0 cursor-pointer whitespace-nowrap rounded-md px-2.5 text-xs transition-all",
              isConfirming
                ? "bg-red-500/20 font-semibold text-red-500 hover:bg-red-500/30"
                : "text-black/65 hover:bg-black/5 hover:text-red-500 active:bg-black/10 dark:text-white/60 dark:hover:bg-white/10",
            )}
          >
            {isConfirming ? "Confirm Clear" : "Clear"}
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
