import { cn } from "../lib/utils";

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded border border-foreground/10 bg-foreground/10 px-1.5 text-[11px] font-medium uppercase text-foreground/85 shadow-sm",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

interface KbdGroupProps {
  keys: string[];
  className?: string;
}

export function KbdGroup({ keys, className }: KbdGroupProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {keys.map((k) => (
        <Kbd key={k}>{k}</Kbd>
      ))}
    </div>
  );
}
