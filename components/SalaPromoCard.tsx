"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export function SalaPromoCard() {
  const { data: session } = useSession();

  return (
    <div className="h-full w-full">
      <div className="relative h-full w-full rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-6 px-6 py-10 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600">
        {/* Noise texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          {/* Logo ATR */}
          <Image
            src="/brand/Isologotipo.webp"
            alt="ATRPoker"
            width={120}
            height={35}
            className="h-8 sm:h-10 w-auto object-contain drop-shadow-lg"
          />

          {/* Título */}
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-tight drop-shadow-md px-2">
            Jugá con los mejores y ganá más
          </h3>

          {/* Botón condicional */}
          <Link
            href={session ? "/academia" : "/login"}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-white hover:bg-white/90 text-zinc-900 font-bold text-sm px-8 py-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {session ? "IR A ACADEMIA" : "REGISTRATE"}
          </Link>
        </div>
      </div>
    </div>
  );
}
