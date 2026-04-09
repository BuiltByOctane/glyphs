import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showClearButton: boolean;
  onClearHistory: () => void;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  showClearButton,
  onClearHistory,
}: SearchBarProps) {
  return (
    <div className="flex items-center px-4 py-3 dark:border-slate-800 sticky top-0 bg-transparent z-10 window-drag">
      <Search
        size={20}
        className="dark:text-white/80 text-black/60 no-drag shrink-0"
      />
      <input
        autoFocus
        className="w-full bg-transparent border-none outline-none text-dark dark:text-slate-200 px-3 py-1 font-regular placeholder:text-white/50 no-drag"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {showClearButton && (
        <button
          onClick={onClearHistory}
          className="text-xs dark:text-white/60 px-3 py-1 active:bg-white/10 cursor-pointer rounded-full text-black hover:text-red-500 transition-colors no-drag"
        >
          Clear
        </button>
      )}
    </div>
  );
}
