const Shortcut = ({ keys, label, onClick }: { keys: string[]; label: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-1.5 px-2 hover:bg-white/5 rounded-md transition-colors py-1 cursor-pointer"
    disabled={!onClick}
  >
    <div className="flex gap-0.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded bg-white/10 border border-white/10 text-[10px] font-medium text-white/70 uppercase"
        >
          {key}
        </kbd>
      ))}
    </div>
    <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
      {label}
    </span>
  </button>
);

export const Footer = ({ onOpenShortcuts }: { onOpenShortcuts: () => void }) => {
  return (
    <div className="h-10 border-t border-white/10 bg-white/[0.02] backdrop-blur-xl flex items-center justify-center gap-1 px-4 select-none shrink-0">
      <Shortcut keys={["\u2318", "K"]} label="Search" />
      <div className="w-px h-3 bg-white/10 mx-1" />
      <Shortcut keys={["\u2191", "\u2193"]} label="Nav" />
      <div className="w-px h-3 bg-white/10 mx-1" />
      <Shortcut keys={["\u21B5"]} label="Select" />
      <div className="w-px h-3 bg-white/10 mx-1" />
      <Shortcut keys={["?"]} label="Shortcuts" onClick={onOpenShortcuts} />
    </div>
  );
};
