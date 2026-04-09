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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col items-center gap-6 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-sm font-medium text-white/70 text-center px-4">
          {isTooLong ? "Content too long" : "Scan to share"}
        </div>

        <div className="bg-white p-4 rounded-xl shadow-inner flex items-center justify-center min-h-[232px] w-[232px]">
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

        <div className="text-xs text-white/40 truncate w-full text-center px-4">
          {content}
        </div>
      </div>
    </div>
  );
}
