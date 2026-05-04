import { Settings as SettingsIcon } from "lucide-react";

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
    className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-foreground/5 disabled:cursor-default"
    disabled={!onClick}
  >
    <div className="flex shrink-0 gap-0.5">
      {keys.map((key) => (
        <kbd
          key={key}
          className="flex h-5 min-w-[1.25rem] items-center justify-center rounded border border-foreground/10 bg-foreground/10 px-1 text-[10px] font-medium uppercase text-foreground/70"
        >
          {key}
        </kbd>
      ))}
    </div>
    <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-foreground/40">
      {label}
    </span>
  </button>
);

interface FooterProps {
  onOpenShortcuts: () => void;
  onOpenSettings: () => void;
}

export const Footer = ({ onOpenShortcuts, onOpenSettings }: FooterProps) => {
  return (
    <div data-tauri-drag-region className="no-scrollbar flex h-10 shrink-0 select-none items-center overflow-x-auto border-t border-foreground/10 bg-foreground/[0.02] px-3 backdrop-blur-xl">
      <div className="mx-auto flex min-w-max items-center gap-1">
        <Shortcut keys={["⌘", "K"]} label="Search" />
        <div className="mx-1 h-3 w-px bg-foreground/10" />
        <Shortcut keys={["↑", "↓"]} label="Nav" />
        <div className="mx-1 h-3 w-px bg-foreground/10" />
        <Shortcut keys={["↵"]} label="Select" />
        <div className="mx-1 h-3 w-px bg-foreground/10" />
        <Shortcut keys={["?"]} label="Shortcuts" onClick={onOpenShortcuts} />
        <div className="mx-1 h-3 w-px bg-foreground/10" />
        <button
          onClick={onOpenSettings}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground/70"
          title="Settings (⌘ ,)"
        >
          <SettingsIcon size={12} />
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wider">
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};
