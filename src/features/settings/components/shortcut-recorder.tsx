import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Kbd } from "../../../components/kbd";
import { cn } from "../../../lib/utils";

interface ShortcutRecorderProps {
  value: string;
  onChange: (next: string) => Promise<void> | void;
}

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

// Convert a JS KeyboardEvent into a Tauri global-shortcut spec like
// "CommandOrControl+Shift+B". Returns null if no non-modifier key was pressed
// or required modifiers are missing.
function eventToShortcut(e: KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.metaKey || e.ctrlKey) parts.push("CommandOrControl");
  if (e.altKey) parts.push("Alt");
  if (e.shiftKey) parts.push("Shift");

  let key = e.key;
  if (MODIFIER_KEYS.has(key)) return null;
  if (key === " ") key = "Space";
  else if (key.length === 1) key = key.toUpperCase();
  // Common arrow / nav names already match Tauri's expectations.

  if (parts.length === 0) return null;
  parts.push(key);
  return parts.join("+");
}

function shortcutToParts(spec: string): string[] {
  return spec
    .split("+")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      if (p === "CommandOrControl") return "⌘";
      if (p === "Command") return "⌘";
      if (p === "Control") return "⌃";
      if (p === "Alt") return "⌥";
      if (p === "Shift") return "⇧";
      return p;
    });
}

export function ShortcutRecorder({ value, onChange }: ShortcutRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!recording) return;
    const handler = async (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === "Escape") {
        setRecording(false);
        setError(null);
        return;
      }
      const next = eventToShortcut(e);
      if (!next) {
        setError("Press at least one modifier (⌘ ⌃ ⌥ ⇧) plus a key.");
        return;
      }
      if (next === value) {
        setRecording(false);
        setError(null);
        return;
      }
      setBusy(true);
      try {
        // Probe with the backend for conflict detection BEFORE we persist.
        await invoke("register_global_shortcut", { shortcut: next });
        await onChange(next);
        setError(null);
        setRecording(false);
      } catch (err) {
        setError(typeof err === "string" ? err : "Could not register shortcut.");
      } finally {
        setBusy(false);
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [recording, value, onChange]);

  // Cancel recording on click outside.
  useEffect(() => {
    if (!recording) return;
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setRecording(false);
        setError(null);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [recording]);

  const parts = shortcutToParts(value);

  return (
    <div ref={wrapRef} className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => {
          setRecording((r) => !r);
          setError(null);
        }}
        disabled={busy}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium transition-colors",
          recording
            ? "border-white/30 bg-white/10 text-white"
            : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white",
          busy && "cursor-not-allowed opacity-50",
        )}
      >
        {recording ? (
          <span className="text-white/70">Press a key combo… (Esc to cancel)</span>
        ) : (
          <>
            {parts.map((p, i) => (
              <Kbd key={i}>{p}</Kbd>
            ))}
            <span className="ml-1 text-white/50">edit</span>
          </>
        )}
      </button>
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
}
