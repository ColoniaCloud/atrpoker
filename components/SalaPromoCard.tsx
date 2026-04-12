"use client";

import Link from "next/link";
import { useRef } from "react";

export function SalaPromoCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--mx", "85%");
    card.style.setProperty("--my", "85%");
  }

  return (
    <div className="h-full w-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-start justify-center gap-6 px-6 py-10 text-left cursor-default select-none"
        style={{
          background:
            "radial-gradient(circle at var(--mx, 85%) var(--my, 85%), #c2410c 0%, #ea580c 35%, #f97316 65%, #fbbf24 100%)",
          "--mx": "85%",
          "--my": "85%",
        } as React.CSSProperties}
      >
        {/* Noise texture overlay for depth */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Suit icons decorativos */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10 text-[160px] leading-none font-black text-zinc-900 select-none">
          ♠
        </div>

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-start gap-5">
          <div className="flex flex-col items-start gap-1">
            <span className="text-4xl font-black tracking-tight text-white leading-tight drop-shadow">
              APRENDÉ,
            </span>
            <span className="text-4xl font-black tracking-tight text-white leading-tight drop-shadow">
              JUGÁ,
            </span>
            <span className="text-4xl font-black tracking-tight text-white leading-tight drop-shadow">
              GANÁ.
            </span>
          </div>

          <span className="text-base font-bold tracking-[0.25em] text-orange-200 uppercase">
            ATRPOKER
          </span>

          <Link
            href="/academia"
            className="mt-1 inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 text-white font-bold text-sm px-7 py-2.5 transition-all duration-200 backdrop-blur-sm"
          >
            REGISTRATE HOY
          </Link>
        </div>
      </div>
    </div>
  );
}
