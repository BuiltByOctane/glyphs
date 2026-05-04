import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Info, X } from "lucide-react";
import { useClipboardStore, type Theme } from "../../../store/use-clipboard-store";
import { SettingRow, Toggle, Segmented } from "./setting-row";
import { ShortcutRecorder } from "./shortcut-recorder";
import { Kbd } from "../../../components/kbd";
import pkg from "../../../../package.json";

const isMac =
  typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

interface SettingsPageProps {
  onClose: () => void;
}

export function SettingsPage({ onClose }: SettingsPageProps) {
  const { settings, updateSettings, clearAllData } = useClipboardStore();
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [maxHistoryDraft, setMaxHistoryDraft] = useState(
    settings.maxHistorySize.toString(),
  );
  const [footerHiddenHint, setFooterHiddenHint] = useState(false);
  const prevShowFooterRef = useRef(settings.showFooter);

  // Keep local input in sync with store updates that didn't originate here.
  useEffect(() => {
    setMaxHistoryDraft(settings.maxHistorySize.toString());
  }, [settings.maxHistorySize]);

  // Auto-reset the destructive-confirm chip after 3s, mirroring SearchBar.
  useEffect(() => {
    if (!confirmingReset) return;
    const t = setTimeout(() => setConfirmingReset(false), 3000);
    return () => clearTimeout(t);
  }, [confirmingReset]);

  // Surface a one-shot hint when the user hides the footer so they know how
  // to reach Settings without it.
  useEffect(() => {
    if (prevShowFooterRef.current && !settings.showFooter) {
      setFooterHiddenHint(true);
    }
    prevShowFooterRef.current = settings.showFooter;
  }, [settings.showFooter]);

  useEffect(() => {
    if (!footerHiddenHint) return;
    const t = setTimeout(() => setFooterHiddenHint(false), 6000);
    return () => clearTimeout(t);
  }, [footerHiddenHint]);

  const commitMaxHistory = () => {
    const parsed = parseInt(maxHistoryDraft, 10);
    if (isNaN(parsed) || parsed < 10 || parsed > 500) {
      setMaxHistoryDraft(settings.maxHistorySize.toString());
      return;
    }
    if (parsed !== settings.maxHistorySize) {
      void updateSettings({ maxHistorySize: parsed });
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-foreground/10 px-3">
        <button
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-foreground/70 transition-colors hover:bg-foreground/10 hover:text-foreground"
          title="Back"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 text-sm font-medium text-foreground">Settings</div>
        <span className="text-[11px] text-foreground/40">⌘ ,</span>
      </div>

      {footerHiddenHint && (
        <div className="mx-3 mt-3 flex items-start gap-2 rounded-md border border-foreground/10 bg-foreground/5 px-3 py-2">
          <Info size={14} className="mt-0.5 shrink-0 text-foreground/60" />
          <div className="flex-1 text-xs text-foreground/80">
            Footer hidden. You can still open Settings any time with{" "}
            <Kbd>⌘</Kbd> <Kbd>,</Kbd>.
          </div>
          <button
            onClick={() => setFooterHiddenHint(false)}
            className="shrink-0 rounded p-0.5 text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground/80"
            title="Dismiss"
          >
            <X size={12} />
          </button>
        </div>
      )}

      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto pb-2">
        <Section title="General">
          <SettingRow
            label="Launch on login"
            description="Start Glyph automatically when you sign in."
          >
            <Toggle
              checked={settings.autoStart}
              onChange={(next) => void updateSettings({ autoStart: next })}
              label="Launch on login"
            />
          </SettingRow>
          <SettingRow
            label="Max history items"
            description="How many recent items Glyph keeps. Pinned items are never trimmed."
          >
            <input
              type="number"
              min={10}
              max={500}
              step={10}
              value={maxHistoryDraft}
              onChange={(e) => setMaxHistoryDraft(e.target.value)}
              onBlur={commitMaxHistory}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              className="h-8 w-20 rounded-md border border-foreground/10 bg-foreground/5 px-2 text-right text-xs text-foreground outline-none focus:border-foreground/30"
            />
          </SettingRow>
        </Section>

        <Section title="Appearance">
          <SettingRow
            label="Theme"
            description="Match system or force a specific mode."
          >
            <Segmented<Theme>
              value={settings.theme}
              onChange={(next) => void updateSettings({ theme: next })}
              options={[
                { value: "system", label: "System" },
                { value: "light", label: "Light" },
                { value: "dark", label: "Dark" },
              ]}
            />
          </SettingRow>
          <SettingRow
            label="Always on top"
            description="Keep Glyph above other windows when shown."
          >
            <Toggle
              checked={settings.alwaysOnTop}
              onChange={(next) => void updateSettings({ alwaysOnTop: next })}
              label="Always on top"
            />
          </SettingRow>
          <SettingRow
            label="Hide when window loses focus"
            description="Auto-close Glyph as soon as you click another app."
          >
            <Toggle
              checked={settings.hideOnBlur}
              onChange={(next) => void updateSettings({ hideOnBlur: next })}
              label="Hide on blur"
            />
          </SettingRow>
          <SettingRow
            label="Show footer"
            description="Show the shortcut hint bar at the bottom of the window."
          >
            <Toggle
              checked={settings.showFooter}
              onChange={(next) => void updateSettings({ showFooter: next })}
              label="Show footer"
            />
          </SettingRow>
        </Section>

        {isMac && (
          <Section title="Screenshots">
            <SettingRow
              label="Auto-import screenshots"
              description="Capture screenshots saved to your screenshot folder (default: Desktop) into history. The original file stays in place."
            >
              <Toggle
                checked={settings.autoCaptureScreenshots}
                onChange={(next) =>
                  void updateSettings({ autoCaptureScreenshots: next })
                }
                label="Auto-import screenshots"
              />
            </SettingRow>
          </Section>
        )}

        <Section title="Shortcuts">
          <SettingRow
            label="Toggle Glyph"
            description="Global shortcut to open or close the clipboard window."
          >
            <ShortcutRecorder
              value={settings.globalShortcut}
              onChange={async (next) => {
                await updateSettings({ globalShortcut: next });
              }}
            />
          </SettingRow>
        </Section>

        <Section title="Data">
          <SettingRow
            label="Clear all data"
            description="Wipes history, groups, and all settings. Cannot be undone."
          >
            <button
              type="button"
              onClick={() => {
                if (confirmingReset) {
                  void clearAllData();
                  setConfirmingReset(false);
                } else {
                  setConfirmingReset(true);
                }
              }}
              className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${
                confirmingReset
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-foreground/5 text-red-400 hover:bg-red-500/10"
              }`}
            >
              {confirmingReset ? "Confirm reset" : "Reset"}
            </button>
          </SettingRow>
        </Section>

        <div className="mt-6 px-4 py-3 text-center text-[11px] text-foreground/40">
          <div>Octane Innovations FOSS</div>
          <div className="mt-0.5">v{pkg.version}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-3">
      <div className="px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/40">
        {title}
      </div>
      <div className="divide-y divide-foreground/5 border-y border-foreground/5 bg-foreground/[0.02]">
        {children}
      </div>
    </div>
  );
}
