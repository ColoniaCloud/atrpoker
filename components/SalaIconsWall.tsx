"use client";

import Link from "next/link";
import { IconsWallBackground, type Logo } from "@/components/IconsWallBackground";

interface Props {
  logos: Logo[];
}

export function SalaIconsWall({ logos }: Props) {
  if (!logos.length) return null;

  return (
    <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden h-[480px]">
      <IconsWallBackground logos={logos} />

      {/* Overlay radial */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(199 85% 5% / 0.45) 0%, hsl(199 85% 5% / 0.55) 25%, hsl(199 85% 5%) 72%)",
        }}
      />

      {/* Contenido central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-4 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-500/40 bg-green-500/15 px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-green-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Dejá de perder tiempo y dinero
        </span>

        <Link
          href="/academia"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-lg px-10 py-4 transition-colors duration-200 shadow-lg shadow-amber-500/20"
        >
          REGISTRATE HOY
        </Link>

        <p className="text-xs font-semibold text-foreground/90 tracking-wide">
          Servicio exclusivo para personas mayores de 18 años.
        </p>
      </div>
    </div>
  );
}
