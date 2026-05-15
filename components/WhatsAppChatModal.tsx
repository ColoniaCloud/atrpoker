"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";

const WA_NUMBER = "5491124932724";

interface Props {
  open: boolean;
  onClose: () => void;
}

function WaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-6 w-6 fill-white"}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppChatModal({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (open) {
      setMessage("");
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleSend() {
    const text = message.trim();
    if (!text) return;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
    onClose();
  }

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop — closes on click, fully transparent */}
      <div
        className={`fixed inset-0 z-overlay transition-opacity duration-200 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Chat card */}
      <div
        className={`fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-[320px] z-modal overflow-hidden rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300 ${
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* WA header */}
        <div className="flex items-center gap-3 bg-[#075E54] px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
            <WaIcon className="h-5 w-5 fill-white" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-tight text-white">ATR Poker</p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4CAF50]" />
              <p className="text-[11px] text-green-200">En línea</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar chat"
            className="shrink-0 text-white/60 transition-colors hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat body */}
        <div
          className="min-h-[160px] px-4 py-4"
          style={{ background: "#ECE5DD" }}
        >
          {/* ATR bubble */}
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-white px-4 py-2.5 shadow-sm">
              <p className="text-sm leading-snug text-[#303030]">
                ¡Hola! ¿En qué podemos ayudarte hoy? 🃏
              </p>
              <p className="mt-1 text-right text-[10px] text-[#999]">ahora</p>
            </div>
          </div>

          {/* User message preview */}
          {message.trim() && (
            <div className="mt-3 flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#DCF8C6] px-4 py-2.5 shadow-sm">
                <p className="text-sm leading-snug text-[#303030]">{message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: "#F0F0F0" }}>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Escribí tu mensaje..."
            className="min-w-0 flex-1 rounded-full bg-white px-4 py-2 text-sm text-[#303030] placeholder:text-[#999] outline-none focus:ring-2 focus:ring-[#25D366]/40"
          />
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            aria-label="Enviar mensaje por WhatsApp"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
