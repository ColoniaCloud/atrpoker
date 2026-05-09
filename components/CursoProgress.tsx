"use client";

import { cn } from "@/lib/utils";
import type { Progreso } from "@/lib/types";
import { calcPoints, getAllCursoItems } from "@/lib/curso";

interface CursoProgressProps {
  progreso: Progreso;
  className?: string;
}

export function CursoProgress({
  progreso,
  className,
}: CursoProgressProps) {
  const items = getAllCursoItems();
  const total = items.length;
  const done = items.filter((item) => progreso[item.slug]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const { total: pts } = calcPoints(progreso);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Tu progreso</span>
            <span className="text-muted-foreground">
              {done} / {total} clases
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-amber-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {pct}% completado
          </p>
        </div>
        <div className="shrink-0 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            ATR pts
          </p>
          <p className="font-oswald text-lg font-semibold leading-none text-amber-300">
            {pts.toLocaleString("es-AR")}
          </p>
        </div>
      </div>
    </div>
  );
}
