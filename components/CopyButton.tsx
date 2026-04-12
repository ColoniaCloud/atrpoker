"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`group relative flex items-center justify-center gap-2 rounded-lg border px-5 py-3 font-mono font-bold text-sm transition-all ${
        copied
          ? "border-green-500/50 bg-green-500/10 text-green-400"
          : "border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
      } ${className}`}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 flex-shrink-0" />
          ¡COPIADO!
        </>
      ) : (
        <>
          <span className="block group-hover:hidden">
            {label ? (
              <span className="text-xs font-normal text-muted-foreground mr-1">{label}</span>
            ) : null}
            {value}
          </span>
          <span className="hidden group-hover:flex items-center gap-2">
            <Copy className="h-4 w-4 flex-shrink-0" />
            COPIAR
          </span>
        </>
      )}
    </button>
  );
}
