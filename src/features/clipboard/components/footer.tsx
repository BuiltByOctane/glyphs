const Shortcut = ({
  keys,
  label,
  onClick,
}: {
  keys: string[];
  label: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-white/5 disabled:cursor-default"
    disabled={!onClick}
  >
    <div className="flex shrink-0 gap-0.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-white/10 bg-white/10 px-1 text-[10px] font-medium uppercase text-white/70"
        >
          {key}
        </kbd>
      ))}
    </div>
    <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-white/40">
      {label}
    </span>
  </button>
);

export const Footer = ({ onOpenShortcuts }: { onOpenShortcuts: () => void }) => {
  return (
    <div className="no-scrollbar flex h-10 shrink-0 select-none items-center overflow-x-auto border-t border-white/10 bg-white/[0.02] px-3 backdrop-blur-xl">
      <div className="mx-auto flex min-w-max items-center gap-1">
        <Shortcut keys={["\u2318", "K"]} label="Search" />
        <div className="mx-1 h-3 w-px bg-white/10" />
        <Shortcut keys={["\u2191", "\u2193"]} label="Nav" />
        <div className="mx-1 h-3 w-px bg-white/10" />
        <Shortcut keys={["\u21B5"]} label="Select" />
        <div className="mx-1 h-3 w-px bg-white/10" />
        <Shortcut keys={["?"]} label="Shortcuts" onClick={onOpenShortcuts} />
      </div>
    </div>
  );
};
