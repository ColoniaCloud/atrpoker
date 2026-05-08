"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, PlayCircle, Trophy, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CursoVideoCard } from "@/components/CursoVideoCard";
import {
  CURSO_SECTIONS,
  getAllCursoItems,
  isItemUnlocked,
  calcPoints,
  POINTS_PER_MODULE,
} from "@/lib/curso";
import type { Progreso } from "@/lib/types";
import type { CursoSection } from "@/lib/curso";
import { cn } from "@/lib/utils";

interface EstudiaPageClientProps {
  progreso: Progreso;
  userName?: string | null;
  userImage?: string | null;
}

// ── Círculo de progreso SVG ────────────────────────────────────────────────────
function CircleProgress({
  pct,
  size = 36,
  stroke = 3,
  color = "#22c55e",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const center = size / 2;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke="#3f3f46"
        strokeWidth={stroke}
      />
      <circle
        cx={center}
        cy={center}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        className="transition-all duration-500"
      />
    </svg>
  );
}

// ── Color de sección a hex (para el círculo) ───────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  emerald: "#34d399",
  sky: "#38bdf8",
  amber: "#fbbf24",
  orange: "#fb923c",
  violet: "#a78bfa",
  rose: "#fb7185",
};

export function EstudiaPageClient({
  progreso,
  userName,
  userImage,
}: EstudiaPageClientProps) {
  const allItems = getAllCursoItems();
  const total = allItems.length;
  const done = allItems.filter((item) => progreso[item.slug]).length;
  const globalPct = total > 0 ? Math.round((done / total) * 100) : 0;
  const { total: pts } = calcPoints(progreso);

  // Módulo actual: el primero que tenga al menos un item no completado
  const currentSection: CursoSection =
    CURSO_SECTIONS.find((s) =>
      s.items.some((item) => !progreso[item.slug])
    ) ?? CURSO_SECTIONS[CURSO_SECTIONS.length - 1];

  const nextItem =
    allItems.find((item) => !progreso[item.slug]) ?? allItems[0];

  // Estado del acordeón: sección abierta
  const [openSection, setOpenSection] = useState<string>(currentSection.id);

  return (
    <div className="py-10">
      {/* ── Cards superiores ──────────────────────────────────────────────── */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2">

        {/* Card 1: Presentación + CTA */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6">
          <div>
            <Badge
              variant="outline"
              className="mb-3 border-amber-500/30 text-amber-400"
            >
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              Curso estructurado
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Estudia{" "}
              <span className="text-amber-400">Progresivamente</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Seguí el curso en orden, marcá cada clase como completada y
              acumulá puntos ATR a medida que avanzás.
            </p>
          </div>
          {nextItem && (
            <Button
              asChild
              size="lg"
              className="mt-6 gap-2 bg-amber-400 text-zinc-950 hover:bg-amber-300"
            >
              <Link href={`/estudia/${nextItem.slug}`}>
                <PlayCircle className="h-5 w-5" />
                {done === 0 ? "Empezar curso" : "Continuar"}
              </Link>
            </Button>
          )}
        </div>

        {/* Card 2: Perfil + progreso */}
        <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
          {/* Avatar + nombre */}
          <div className="flex items-center gap-3">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName ?? "Usuario"}
                width={44}
                height={44}
                className="rounded-full object-cover ring-2 ring-amber-400/30"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/20 text-sm font-bold text-amber-400 ring-2 ring-amber-400/30">
                {(userName ?? "U").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-foreground">
                {userName ?? "Mi cuenta"}
              </p>
              <p className="text-xs text-muted-foreground">Estudiante ATR</p>
            </div>
          </div>

          {/* Progreso global */}
          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progreso total</span>
              <span>
                {done}/{total} clases · {globalPct}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-500"
                style={{ width: `${globalPct}%` }}
              />
            </div>
          </div>

          {/* Módulo actual */}
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-background/60 px-3 py-2">
            <span className="text-xs text-muted-foreground">Módulo actual</span>
            <span className="ml-auto max-w-[180px] truncate text-right text-xs font-semibold text-foreground">
              {currentSection.label}
            </span>
          </div>

          {/* Puntos ATR */}
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-3 py-2">
            <Trophy className="h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-xs text-muted-foreground">Puntos ATR ganados</p>
              <p className="text-xl font-black leading-none text-amber-300">
                {pts.toLocaleString("es-AR")}{" "}
                <span className="text-xs font-semibold text-amber-500">pts</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Módulo actual: videos ─────────────────────────────────────────── */}
      {(() => {
        const sectionItems = currentSection.items;
        const sectionDone = sectionItems.filter((i) => progreso[i.slug]).length;
        const sectionPct =
          sectionItems.length > 0
            ? Math.round((sectionDone / sectionItems.length) * 100)
            : 0;
        const globalStart = allItems.findIndex(
          (i) => i.slug === sectionItems[0]?.slug
        );
        const remaining = sectionItems.length - sectionDone;

        return (
          <div className="mb-10 rounded-2xl border border-border/60 bg-card p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Módulo actual
                </p>
                <h2 className="mt-0.5 text-lg font-bold text-foreground">
                  {currentSection.label}
                </h2>
              </div>
              <CircleProgress
                pct={sectionPct}
                size={48}
                stroke={4}
                color={COLOR_MAP[currentSection.color] ?? "#fbbf24"}
              />
            </div>

            {/* Barra de progreso del módulo */}
            <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {sectionDone}/{sectionItems.length} clases
              </span>
              <span>{sectionPct}%</span>
            </div>
            <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${sectionPct}%`,
                  backgroundColor: COLOR_MAP[currentSection.color] ?? "#fbbf24",
                }}
              />
            </div>

            {/* Mensaje de bonus */}
            {remaining > 0 && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-400">
                <Star className="h-3.5 w-3.5 shrink-0" />
                Completá las {remaining} clase
                {remaining !== 1 ? "s" : ""} restante
                {remaining !== 1 ? "s" : ""} para ganar{" "}
                <strong>{POINTS_PER_MODULE} pts ATR</strong> de bonus.
              </div>
            )}

            {/* Lista de videos */}
            <div className="space-y-1.5">
              {sectionItems.map((item, itemIdx) => {
                const absoluteIdx = globalStart + itemIdx;
                const unlocked = isItemUnlocked(absoluteIdx, allItems, progreso);
                return (
                  <CursoVideoCard
                    key={item.slug}
                    item={item}
                    index={absoluteIdx}
                    progreso={progreso}
                    isUnlocked={unlocked}
                    sectionColor={currentSection.color}
                  />
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── Acordeón de todos los módulos ────────────────────────────────── */}
      <div className="space-y-2">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Todos los módulos
        </h2>
        {CURSO_SECTIONS.filter((s) => s.items.length > 0).map((section) => {
          const isOpen = openSection === section.id;
          const sectionDone = section.items.filter(
            (i) => progreso[i.slug]
          ).length;
          const sectionPct =
            section.items.length > 0
              ? Math.round((sectionDone / section.items.length) * 100)
              : 0;
          const globalStart = allItems.findIndex(
            (i) => i.slug === section.items[0]?.slug
          );
          const isCurrent = section.id === currentSection.id;

          return (
            <div
              key={section.id}
              className={cn(
                "overflow-hidden rounded-xl border transition-colors",
                isOpen ? "border-border/80 bg-card" : "border-border/40 bg-card/50"
              )}
            >
              {/* Header del acordeón */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? "" : section.id)}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {section.label}
                    </span>
                    {isCurrent && (
                      <span className="shrink-0 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-400">
                        Actual
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {sectionDone}/{section.items.length} clases completadas
                  </p>
                </div>

                {/* Círculo de progreso */}
                <div className="relative shrink-0">
                  <CircleProgress
                    pct={sectionPct}
                    size={34}
                    stroke={3}
                    color={COLOR_MAP[section.color] ?? "#fbbf24"}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground/80">
                    {sectionPct}%
                  </span>
                </div>

                <ChevronDown
                  className={cn(
                    "ml-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Videos del acordeón */}
              {isOpen && (
                <div className="border-t border-border/40 px-3 pb-3 pt-2">
                  <div className="space-y-1">
                    {section.items.map((item, itemIdx) => {
                      const absoluteIdx = globalStart + itemIdx;
                      const unlocked = isItemUnlocked(
                        absoluteIdx,
                        allItems,
                        progreso
                      );
                      return (
                        <CursoVideoCard
                          key={item.slug}
                          item={item}
                          index={absoluteIdx}
                          progreso={progreso}
                          isUnlocked={unlocked}
                          sectionColor={section.color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
