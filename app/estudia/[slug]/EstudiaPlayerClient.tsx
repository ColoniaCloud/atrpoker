"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { MarkCompleteButton } from "@/components/MarkCompleteButton";
import { CursoProgress } from "@/components/CursoProgress";
import { CursoVideoCard } from "@/components/CursoVideoCard";
import type { WPPost } from "@/lib/types";
import type { Progreso } from "@/lib/types";
import type { CursoItem, CursoSection } from "@/lib/curso";
import { isItemUnlocked } from "@/lib/curso";

interface EstudiaPlayerClientProps {
  post: WPPost;
  bunnyUrl: string | undefined;
  item: CursoItem;
  allItems: CursoItem[];
  sections: CursoSection[];
  prevSlug: string | null;
  nextSlug: string | null;
  initialProgreso: Progreso;
}

export function EstudiaPlayerClient({
  post,
  bunnyUrl,
  item,
  allItems,
  sections,
  prevSlug,
  nextSlug,
  initialProgreso,
}: EstudiaPlayerClientProps) {
  const [progreso, setProgreso] = useState<Progreso>(initialProgreso);

  const handleToggle = useCallback((slug: string, completed: boolean) => {
    setProgreso((prev) => ({ ...prev, [slug]: completed }));
  }, []);

  const handleVideoEnded = useCallback(() => {
    if (!progreso[item.slug]) {
      setProgreso((prev) => ({ ...prev, [item.slug]: true }));
      // El MarkCompleteButton se encarga del guardado — disparamos el fetch
      fetch("/api/progreso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: item.slug, completed: true }),
      }).catch(() => {
        // Fallback a localStorage si falla
        try {
          const stored = JSON.parse(
            localStorage.getItem("atrpoker_progreso") ?? "{}"
          ) as Record<string, boolean>;
          stored[item.slug] = true;
          localStorage.setItem("atrpoker_progreso", JSON.stringify(stored));
        } catch {
          // noop
        }
      });
    }
  }, [item.slug, progreso]);

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/estudia" className="hover:text-foreground transition-colors">
          Estudia Progresivamente
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span
          className="truncate text-foreground/70"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </nav>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        {/* ── Columna principal ─────────────────────────────────────────── */}
        <div className="min-w-0">
          {/* Título */}
          <h1
            className="mb-4 text-2xl font-black text-foreground sm:text-3xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {/* Player */}
          {bunnyUrl ? (
            <BunnyPlayer
              src={bunnyUrl}
              title={post.title.rendered.replace(/<[^>]+>/g, "")}
              onEnded={handleVideoEnded}
              className="mb-6"
            />
          ) : (
            <div className="mb-6 flex aspect-video items-center justify-center rounded-xl border border-border bg-card">
              <div className="text-center text-muted-foreground">
                <VideoOff className="mx-auto mb-3 h-16 w-16 text-muted-foreground/30" />
                <p>El video no está disponible en este momento.</p>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <MarkCompleteButton
              slug={item.slug}
              initialCompleted={!!progreso[item.slug]}
              onToggle={handleToggle}
            />
            <div className="flex gap-2 ml-auto">
              {prevSlug && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/estudia/${prevSlug}`}>
                    <ArrowLeft className="h-4 w-4" />
                    Anterior
                  </Link>
                </Button>
              )}
              {nextSlug && (
                <Button asChild size="sm" className="gap-1.5 bg-amber-400 text-zinc-950 hover:bg-amber-300">
                  <Link href={`/estudia/${nextSlug}`}>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Descripción del post */}
          {post.content.rendered && (
            <div
              className="wp-content"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          )}

          <Separator className="mt-10 mb-8" />

          <Button asChild variant="outline" size="sm">
            <Link href="/estudia">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </Link>
          </Button>
        </div>

        {/* ── Sidebar: lista del curso ───────────────────────────────────── */}
        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <CursoProgress
              progreso={progreso}
            />
            <Separator />
            <div className="max-h-[calc(100vh-240px)] overflow-y-auto space-y-6 pr-1">
              {sections.filter((s) => s.items.length > 0).map((section) => {
                const sectionStartIdx = allItems.findIndex(
                  (i) => i.slug === section.items[0]?.slug
                );
                return (
                  <div key={section.id}>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {section.label}
                    </p>
                    <div className="space-y-1">
                      {section.items.map((sItem, itemIdx) => {
                        const absoluteIdx = sectionStartIdx + itemIdx;
                        const isUnlocked = isItemUnlocked(absoluteIdx, allItems, progreso);
                        return (
                          <CursoVideoCard
                            key={sItem.slug}
                            item={sItem}
                            index={absoluteIdx}
                            progreso={progreso}
                            isActive={sItem.slug === item.slug}
                            isUnlocked={isUnlocked}
                            sectionColor={section.color}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
