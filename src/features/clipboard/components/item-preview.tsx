import { Type, Image as ImageIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";
import { ClipboardItem, Group } from "../../../store/use-clipboard-store";

interface ItemPreviewProps {
  item: ClipboardItem;
  rect: DOMRect;
  groups: Group[];
}

type PreviewIcon = ComponentType<{ size?: number; className?: string }>;
const iconMap = LucideIcons as unknown as Record<string, PreviewIcon>;

const PREVIEW_W = 360;
const PREVIEW_H = 220;
const GAP = 10;
const EDGE_PADDING = 8;

function formatRelative(timestamp: number): string {
  const diff = (Date.now() - timestamp) / 1000;
  if (diff < 5) return "just now";
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function ItemPreview({ item, rect, groups }: ItemPreviewProps) {
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const w = Math.min(PREVIEW_W, winW - 2 * EDGE_PADDING);

  // Prefer placing below the row; flip above if it would overflow the bottom.
  let top = rect.bottom + GAP;
  if (top + PREVIEW_H + EDGE_PADDING > winH) {
    top = rect.top - PREVIEW_H - GAP;
  }
  top = Math.max(EDGE_PADDING, Math.min(top, winH - EDGE_PADDING));

  // Center horizontally on the row, then clamp to viewport.
  let left = rect.left + (rect.width - w) / 2;
  left = Math.max(EDGE_PADDING, Math.min(left, winW - w - EDGE_PADDING));

  const group = item.groupId ? groups.find((g) => g.id === item.groupId) : null;
  const GroupIcon = group ? iconMap[group.icon] || LucideIcons.Folder : null;

  return (
    <div
      className="no-drag pointer-events-none fixed z-40 flex flex-col overflow-hidden rounded-lg border border-foreground/15 bg-background/95 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
      style={{ left, top, width: w, maxHeight: PREVIEW_H }}
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {item.type === "text" ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground/90">
            {item.content}
          </pre>
        ) : (
          <div className="flex items-center justify-center">
            <img
              src={item.content}
              alt="clipboard preview"
              className="max-h-[170px] max-w-full rounded border border-foreground/10 object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t border-foreground/10 bg-foreground/[0.04] px-3 py-1.5 text-[11px] text-foreground/60">
        {item.type === "text" ? (
          <>
            <Type size={11} className="shrink-0" />
            <span>{item.content.length.toLocaleString()} chars</span>
          </>
        ) : (
          <>
            <ImageIcon size={11} className="shrink-0" />
            <span>image</span>
          </>
        )}
        <span className="text-foreground/30">·</span>
        <span>{formatRelative(item.timestamp)}</span>
        {group && GroupIcon && (
          <>
            <span className="text-foreground/30">·</span>
            <span className="flex min-w-0 items-center gap-1">
              <GroupIcon size={11} className="shrink-0 text-foreground/60" />
              <span className="truncate">{group.name}</span>
            </span>
          </>
        )}
        {item.isPinned && (
          <>
            <span className="text-foreground/30">·</span>
            <span className="text-foreground/80">pinned</span>
          </>
        )}
      </div>
    </div>
  );
}
