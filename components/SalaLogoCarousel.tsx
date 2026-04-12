"use client";

import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import type { WPSala } from "@/lib/types";

interface LogoObject {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface SalaLogoCarouselProps {
  salas: WPSala[];
  /** Delay entre slides en ms (default 2200) */
  autoplayDelay?: number;
}

/** Devuelve opacidad [0.2, 1] según la distancia normalizada al centro */
function calcOpacity(snapProgress: number, scrollProgress: number): number {
  let diff = snapProgress - scrollProgress;
  // Wrap [-0.5, 0.5] para que el loop no produzca saltos en el extremo
  if (diff > 0.5) diff -= 1;
  if (diff < -0.5) diff += 1;
  const absDiff = Math.abs(diff);
  if (absDiff < 0.04) return 1;
  if (absDiff < 0.28) return Math.max(0.32, 1 - absDiff * 2.8);
  return 0.2;
}

export function SalaLogoCarousel({
  salas,
  autoplayDelay = 2200,
}: SalaLogoCarouselProps) {
  const salasWithLogos = salas.filter((s) => {
    const l = s.acf?.logo_entero;
    return l && typeof l === "object" && "url" in l && (l as LogoObject).url;
  });

  const count = salasWithLogos.length;

  const [tweenValues, setTweenValues] = useState<number[]>(() =>
    Array.from({ length: count }, (_, i) => (i === 0 ? 1 : 0.2))
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: false },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  /**
   * Recalcula en cada frame de scroll usando scrollProgress.
   * Esto evita el "salto" visual en el boundary del loop porque
   * el diff se normaliza al rango [-0.5, 0.5].
   */
  const updateTweens = useCallback(() => {
    if (!emblaApi) return;
    const progress = emblaApi.scrollProgress();
    const snaps = emblaApi.scrollSnapList();
    setTweenValues(snaps.map((snap) => calcOpacity(snap, progress)));
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateTweens();
    // "scroll" se dispara en cada frame de animación → tween continuo y suave
    emblaApi.on("scroll", updateTweens);
    emblaApi.on("reInit", updateTweens);
    return () => {
      emblaApi.off("scroll", updateTweens);
      emblaApi.off("reInit", updateTweens);
    };
  }, [emblaApi, updateTweens]);

  if (salasWithLogos.length === 0) return null;

  return (
    <div
      className="w-full border-y border-border bg-card/40 py-8 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
      }}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex items-center touch-pan-y">
          {salasWithLogos.map((sala, index) => {
            const logo = sala.acf.logo_entero as LogoObject;
            const opacity = tweenValues[index] ?? 0.2;
            // escala entre 0.80 (opacidad mínima) y 1.02 (foco)
            const scale = 0.80 + opacity * 0.22;

            return (
              <div
                key={sala.id}
                // móvil: 1 visible (bordes asoman) · sm: 3 · lg: 5
                className="flex-[0_0_70%] sm:flex-[0_0_36%] lg:flex-[0_0_22%] xl:flex-[0_0_18%] flex items-center justify-center px-6"
                style={{ opacity, transform: `scale(${scale})` }}
              >
                <Link
                  href={`/salas/${sala.slug}`}
                  title={sala.title.rendered}
                  className="flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                >
                  <Image
                    src={logo.url}
                    alt={logo.alt || sala.title.rendered}
                    width={logo.width || 180}
                    height={logo.height || 64}
                    className="object-contain h-14 w-auto max-w-[180px]"
                    draggable={false}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
