"use client";

import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CursoItem } from "@/lib/curso";
import type { Progreso } from "@/lib/types";

interface CursoVideoCardProps {
  item: CursoItem;
  index: number;
  progreso: Progreso;
  isActive?: boolean;
  /** Si el item anterior está completado (o es el primero), está disponible. */
  isUnlocked: boolean;
  sectionColor: string;
}

export function CursoVideoCard({
  item,
  index,
  progreso,
  isActive,
  isUnlocked,
  sectionColor,
}: CursoVideoCardProps) {
  const isCompleted = !!progreso[item.slug];

  const colorMap: Record<string, string> = {
    emerald: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    sky: "text-sky-400 border-sky-500/40 bg-sky-500/10",
    violet: "text-violet-400 border-violet-500/40 bg-violet-500/10",
    amber: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    orange: "text-orange-400 border-orange-500/40 bg-orange-500/10",
    rose: "text-rose-400 border-rose-500/40 bg-rose-500/10",
  };

  const accentClass = colorMap[sectionColor] ?? colorMap.amber;

  if (!isUnlocked) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-border/40 px-4 py-3 opacity-40">
        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted-foreground">{item.title}</p>
          {item.duration && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/60">
              <Clock className="h-3 w-3" />
              {item.duration}
            </p>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">#{index + 1}</span>
      </div>
    );
  }

  return (
    <Link
      href={`/estudia/${item.slug}`}
      className={cn(
        "group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
        isActive
          ? cn("border", accentClass)
          : isCompleted
          ? "border-border/60 bg-zinc-900/50 hover:border-border hover:bg-zinc-800/60"
          : "border-border/40 hover:border-border hover:bg-zinc-800/40"
      )}
    >
      {/* Ícono de estado */}
      <div className="shrink-0">
        {isActive ? (
          <PlayCircle className={cn("h-5 w-5", `text-${sectionColor}-400`)} />
        ) : isCompleted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground/50 group-hover:text-muted-foreground" />
        )}
      </div>

      {/* Texto */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium",
            isActive
              ? `text-${sectionColor}-400`
              : isCompleted
              ? "text-foreground/70"
              : "text-foreground/90 group-hover:text-foreground"
          )}
        >
          {item.title}
        </p>
        {item.duration && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            {item.duration}
          </p>
        )}
      </div>

      {/* Número */}
      <span className="shrink-0 text-xs text-muted-foreground">#{index + 1}</span>
    </Link>
  );
}
