"use client";

import Image from "next/image";

export interface Logo {
  url: string;
  alt?: string;
}

interface Props {
  logos: Logo[];
  cols?: number;
  baseDuration?: number;
}

const REPEAT = 4;

export function IconsWallBackground({ logos, cols = 9, baseDuration = 20 }: Props) {
  if (!logos.length) return null;

  const columns = Array.from({ length: cols }, (_, colIdx) => {
    const offset = (colIdx * Math.ceil(logos.length / cols)) % logos.length;
    const shifted = [...logos.slice(offset), ...logos.slice(0, offset)];
    const items = Array.from({ length: REPEAT }, () => shifted).flat();
    const goUp = colIdx % 2 === 0;
    const duration = baseDuration + colIdx * 2;
    return { items, goUp, duration };
  });

  return (
    <div
      className="absolute inset-0 flex items-start justify-center gap-4 overflow-hidden"
      style={{ transform: "rotate(-14deg) scale(1.25)", transformOrigin: "center center" }}
    >
      {columns.map((col, ci) => (
        <div
          key={ci}
          className="flex flex-col gap-4 shrink-0"
          style={{
            animation: `${col.goUp ? "scroll-up" : "scroll-down"} ${col.duration}s linear infinite`,
          }}
        >
          {col.items.map((logo, li) => (
            <div
              key={li}
              className="w-16 h-16 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center p-2 shrink-0"
            >
              <Image
                src={logo.url}
                alt={logo.alt || ""}
                width={48}
                height={48}
                className="object-contain w-full h-full opacity-60"
                draggable={false}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
