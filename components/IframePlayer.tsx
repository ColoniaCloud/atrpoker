"use client";

import { useRef } from "react";
import { Maximize2 } from "lucide-react";


interface Props {
  src: string;
  title: string;
  height?: number;
  linkTo?: string;
  linkLabel?: string;
}


export function IframePlayer({ src, title, height = 700, linkTo, linkLabel }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleFullscreen() {
    const el = iframeRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
  }

  return (
    <div className="mx-auto w-full max-w-full lg:max-w-[860px] px-4 sm:px-0">
      {/* Barra superior decorativa */}
      <div className="flex items-center gap-2 rounded-t-2xl border border-b-0 border-border bg-card px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/60" />
        <span className="h-3 w-3 rounded-full bg-amber-500/60" />
        <span className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-3 flex-1 rounded-md border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground truncate select-none">
          {title}
        </span>
        <button
          onClick={handleFullscreen}
          className="ml-2 flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          <Maximize2 className="h-4 w-4" />
          Pantalla completa
        </button>
        {linkTo && linkLabel && (
          <a
            href={linkTo}
            className="ml-2 flex shrink-0 items-center gap-1.5 rounded-md border border-orange-600 bg-orange-500 hover:bg-orange-600 px-3 py-1.5 text-xs font-bold text-white transition-colors"
            style={{ textDecoration: 'none' }}
          >
            {linkLabel}
          </a>
        )}
      </div>

      {/* iframe */}
      <div className="overflow-hidden rounded-b-2xl border border-border bg-black shadow-2xl shadow-black/40">
        <iframe
          ref={iframeRef}
          src={src}
          allowFullScreen
          frameBorder="0"
          className="block w-full"
          style={{ height: `${height}px` }}
          title={title}
        />
      </div>
    </div>
  );
}
