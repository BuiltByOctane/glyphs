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
      <div className="flex items-center px-4 py-3 dark:border-slate-800 sticky top-0 bg-transparent z-10 window-drag">
        <Search
          size={20}
          className="dark:text-white/80 text-black/60 no-drag shrink-0"
        />
        <input
          ref={ref}
          autoFocus
          className="w-full bg-transparent border-none outline-none text-dark dark:text-slate-200 px-3 py-1 font-regular placeholder:text-white/50 no-drag"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {showClearButton && (
          <button
            onClick={handleClearClick}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-all no-drag cursor-pointer whitespace-nowrap",
              isConfirming
                ? "bg-red-500/20 text-red-500 hover:bg-red-500/30 font-semibold"
                : "dark:text-white/60 text-black hover:text-red-500 active:bg-white/10",
            )}
          >
            {isConfirming ? "Clear All History?" : "Clear"}
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
