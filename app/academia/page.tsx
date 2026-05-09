import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Ruler, Brain, Target, Trophy, Film, Spade, type LucideIcon } from "lucide-react";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { ESCUELA_SUBCATEGORIES } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AcademiaFilterSelect } from "@/components/AcademiaFilterSelect";

export const metadata: Metadata = {
  title: "Academia de Póker | ATRPoker",
  description:
    "Cursos, clases grupales, coaching mental y sesiones en vivo para llevar tu juego al siguiente nivel.",
  openGraph: {
    title: "Academia de Póker | ATRPoker",
    description: "Formación y desarrollo para jugadores de póker de todos los niveles.",
  },
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ page?: string; cat?: string }>;
}

// Visual metadata per subcategory — all class strings are complete so Tailwind detects them
const SUBCAT_META: Record<string, {
  icon: LucideIcon;
  desc: string;
  cardHover: string;
  tag: string;
  arrow: string;
}> = {
  "curso-principiantes": {
    icon: GraduationCap,
    desc: "Arrancá desde cero y dominá los fundamentos del juego con bases sólidas.",
    cardHover: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
    tag: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    arrow: "text-emerald-400",
  },
  "curso-teorico-practico": {
    icon: Ruler,
    desc: "Teoría profunda aplicada directamente al juego real y al análisis de manos.",
    cardHover: "hover:border-sky-500/50 hover:bg-sky-500/5",
    tag: "border-sky-500/25 bg-sky-500/10 text-sky-400",
    arrow: "text-sky-400",
  },
  "mental-coach": {
    icon: Brain,
    desc: "Entrenamiento mental para rendir al máximo bajo presión y gestionar emociones.",
    cardHover: "hover:border-violet-500/50 hover:bg-violet-500/5",
    tag: "border-violet-500/25 bg-violet-500/10 text-violet-400",
    arrow: "text-violet-400",
  },
  "clases-grupales": {
    icon: Target,
    desc: "Clases en vivo con BlueGhost y Piaggesi para jugadores de todos los niveles.",
    cardHover: "hover:border-amber-500/50 hover:bg-amber-500/5",
    tag: "border-amber-500/25 bg-amber-500/10 text-amber-400",
    arrow: "text-amber-400",
  },
  "clases-grupales-straussj": {
    icon: Trophy,
    desc: "Estrategia de alto nivel directamente con el coach StraussJ.",
    cardHover: "hover:border-orange-500/50 hover:bg-orange-500/5",
    tag: "border-orange-500/25 bg-orange-500/10 text-orange-400",
    arrow: "text-orange-400",
  },
  "sesion-live": {
    icon: Film,
    desc: "Análisis de manos reales junto a los coaches en tiempo real.",
    cardHover: "hover:border-rose-500/50 hover:bg-rose-500/5",
    tag: "border-rose-500/25 bg-rose-500/10 text-rose-400",
    arrow: "text-rose-400",
  },
};

const FALLBACK_META = {
  icon: Spade,
  desc: "",
  cardHover: "hover:border-border",
  tag: "border-border bg-muted/40 text-muted-foreground",
  arrow: "text-muted-foreground",
};

export default async function AcademiaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const activeCat = params.cat ?? null;

  let categoryId: number | undefined;
  let categoryIds: number[] | undefined;

  if (activeCat) {
    const cat = await getCategoryBySlug(activeCat);
    if (cat) categoryId = cat.id;
  } else {
    const cats = await Promise.all(
      ESCUELA_SUBCATEGORIES.map((s) => getCategoryBySlug(s.slug))
    );
    const ids = cats.map((c) => c?.id).filter((id): id is number => !!id);
    if (ids.length > 0) categoryIds = ids;
  }

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId,
    categoryIds,
  });

  const activeSubcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === activeCat);
  const basePath = activeCat ? `/academia?cat=${activeCat}` : "/academia";

  return (
    <>
      {/* ── Hero full-bleed ──────────────────────────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-32 pb-16 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-background" />
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[200px] w-[350px] sm:h-[300px] sm:w-[550px] lg:h-[380px] lg:w-[700px] rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-3xl text-center px-4">
          <Badge
            variant="outline"
            className="mb-5 border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
          >
            Gratis para todos
          </Badge>
          <h1 className="mb-4 text-5xl font-black leading-tight text-foreground md:text-6xl">
            Academia de{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              Póker
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Cursos, clases grupales, coaching mental y sesiones en vivo para llevar tu juego al siguiente nivel.
          </p>
        </div>
      </section>

      <div className="py-12">

        {/* ── Áreas de estudio (solo en vista "Todos") ──────── */}
        {!activeCat && (
          <section className="mb-14">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">Áreas de estudio</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Elegí el área que más te interesa y empezá a aprender
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ESCUELA_SUBCATEGORIES.map((sub) => {
                const meta = SUBCAT_META[sub.slug] ?? FALLBACK_META;
                return (
                  <Link
                    key={sub.slug}
                    href={`/academia/${sub.slug}`}
                    className={cn(
                      "group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300",
                      meta.cardHover
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <meta.icon className={cn("h-7 w-7", meta.arrow)} />
                      <ArrowRight
                        className={cn(
                          "h-4 w-4 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100",
                          meta.arrow
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="mb-1.5 font-bold leading-tight text-foreground">
                        {sub.label}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {meta.desc}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "self-start rounded-full border px-2.5 py-1 text-[11px] font-semibold",
                        meta.tag
                      )}
                    >
                      Ver contenidos →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Section header + filter ───────────────────────── */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {activeSubcat?.label ?? "Últimas publicaciones"}
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {total} contenido{total !== 1 ? "s" : ""}
            </p>
          </div>
          <AcademiaFilterSelect
            subcategories={ESCUELA_SUBCATEGORIES}
            activeCat={activeCat}
          />
        </div>

        {/* ── Grid ──────────────────────────────────────────── */}
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Spade className="mb-4 h-16 w-16 text-muted-foreground/20" />
            <p className="text-lg text-muted-foreground">
              No hay contenidos publicados
              {activeSubcat ? ` en ${activeSubcat.label}` : ""} aún.
            </p>
          </div>
        )}

      </div>
    </>
  );
}
