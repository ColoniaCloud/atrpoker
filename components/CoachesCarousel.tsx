"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WPCoach } from "@/lib/types";
import { stripHtml } from "@/lib/wordpress";

interface Props {
  coaches: WPCoach[];
  /** Slug del coach activo, para resaltarlo */
  currentSlug?: string;
}

export function CoachesCarousel({ coaches, currentSlug }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateButtons();
    emblaApi.on("select", updateButtons);
    emblaApi.on("reInit", updateButtons);
    return () => {
      emblaApi.off("select", updateButtons);
      emblaApi.off("reInit", updateButtons);
    };
  }, [emblaApi, updateButtons]);

  if (!coaches.length) return null;

  return (
    <div className="relative">
      {/* Fades laterales */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10"
        style={{ background: "linear-gradient(to right, hsl(199 85% 5%), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10"
        style={{ background: "linear-gradient(to left, hsl(199 85% 5%), transparent)" }}
      />

      {/* Botones nav */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-amber-500/40 disabled:opacity-30 transition-colors backdrop-blur-sm"
        aria-label="Anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-amber-500/40 disabled:opacity-30 transition-colors backdrop-blur-sm"
        aria-label="Siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Track */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4 touch-pan-y">
          {coaches.map((coach) => {
            const name = stripHtml(coach.title.rendered);
            const especialidad = coach.acf?.especialidad ?? coach.acf?.disciplina ?? null;
            const photo = coach._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
            const isCurrent = coach.slug === currentSlug;

            return (
              <Link
                key={coach.id}
                href={`/coaches/${coach.slug}`}
                className={`group flex-[0_0_72%] sm:flex-[0_0_42%] lg:flex-[0_0_28%] xl:flex-[0_0_22%] rounded-2xl border bg-card overflow-hidden transition-colors ${
                  isCurrent
                    ? "border-amber-500/50 pointer-events-none"
                    : "border-border hover:border-amber-500/40"
                }`}
              >
                {/* Foto */}
                <div className="relative h-44 w-full bg-zinc-900 overflow-hidden">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={name}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl font-black text-zinc-700">
                      {name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                      <span className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-zinc-950">
                        Estás aquí
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-1.5">
                  <p className="font-bold text-foreground leading-tight group-hover:text-amber-400 transition-colors">
                    {name}
                  </p>
                  {especialidad && (
                    <p className="text-xs text-muted-foreground">{especialidad}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
