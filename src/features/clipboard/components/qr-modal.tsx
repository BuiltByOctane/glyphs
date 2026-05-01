import { QRCodeSVG } from "qrcode.react";
import { X } from "lucide-react";
import { useEffect } from "react";

interface QrModalProps {
  content: string;
  onClose: () => void;
}

export function QrModal({ content, onClose }: QrModalProps) {
  // Max length for a QR code varies by version and error correction.
  // A safe limit for alphanumeric/binary data at level 'M' is around 2000-2500 characters.
  const MAX_QR_LENGTH = 2048;
  const isTooLong = content.length > MAX_QR_LENGTH;

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc, { capture: true });
    return () =>
      window.removeEventListener("keydown", handleEsc, { capture: true });
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center w-full justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200 rounded-2xl">
      <div className="absolute inset-0" onClick={onClose} />
      <button
        onClick={onClose}
        className="absolute right-4 z-50 cursor-pointer top-4 flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X size={20} />
      </button>
      <div className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col items-center gap-6 overflow-hidden rounded-lg p-6 animate-in zoom-in-95 duration-200">

        <div className="text-sm font-medium text-white/70 text-center px-4">
          {isTooLong ? "Content too long" : "Scan to share"}
        </div>

        <div className="flex min-h-[232px] w-[232px] max-w-full items-center justify-center rounded-lg bg-white p-4 shadow-inner">
          {isTooLong ? (
            <div className="text-black text-xs text-center px-4 leading-relaxed opacity-60">
              This item is too large ({content.length} characters) to be
              converted into a QR code.
            </div>
          ) : (
            <QRCodeSVG
              value={content}
              size={200}
              level="M"
              includeMargin={false}
            />
          )}
        </div>

        <div className="w-full truncate px-4 text-center text-xs text-white/40">
          {content}
        </div>
      </div>
    </div>
  );
}
