import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { ESCUELA_SUBCATEGORIES } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { Badge } from "@/components/ui/badge";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Visual metadata per subcategory — complete class strings for Tailwind detection
const SUBCAT_ACCENT: Record<string, {
  icon: string;
  desc: string;
  glow: string;
  badge: string;
}> = {
  "curso-principiantes": {
    icon: "🃏",
    desc: "Fundamentos sólidos para empezar a jugar con confianza y criterio.",
    glow: "bg-emerald-500/8",
    badge: "border-emerald-500/30 text-emerald-400",
  },
  "curso-teorico-practico": {
    icon: "📐",
    desc: "Teoría profunda llevada al juego real con análisis y ejercicios prácticos.",
    glow: "bg-sky-500/8",
    badge: "border-sky-500/30 text-sky-400",
  },
  "mental-coach": {
    icon: "🧠",
    desc: "Entrenamiento mental para rendir al máximo bajo presión y gestionar el tilt.",
    glow: "bg-violet-500/8",
    badge: "border-violet-500/30 text-violet-400",
  },
  "clases-grupales": {
    icon: "🎯",
    desc: "Clases en vivo con BlueGhost y Piaggesi para jugadores de todos los niveles.",
    glow: "bg-amber-500/8",
    badge: "border-amber-500/30 text-amber-400",
  },
  "clases-grupales-straussj": {
    icon: "🏆",
    desc: "Estrategia de alto nivel y análisis en profundidad con el coach StraussJ.",
    glow: "bg-orange-500/8",
    badge: "border-orange-500/30 text-orange-400",
  },
  "sesion-live": {
    icon: "🎬",
    desc: "Análisis de manos reales en tiempo real junto a los coaches del equipo.",
    glow: "bg-rose-500/8",
    badge: "border-rose-500/30 text-rose-400",
  },
};

const FALLBACK_ACCENT = {
  icon: "♠",
  desc: "",
  glow: "bg-amber-500/5",
  badge: "border-amber-500/30 text-amber-400",
};

export async function generateStaticParams() {
  return ESCUELA_SUBCATEGORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const subcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === slug);
  if (!subcat) return { title: "Categoría no encontrada" };
  return {
    title: `${subcat.label} | Academia ATRPoker`,
    description: `Contenidos de ${subcat.label} en la Academia de Póker de ATRPoker.`,
  };
}

export default async function AcademiaSubcatPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page ?? 1);

  const subcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === slug);
  if (!subcat) notFound();

  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId: cat.id,
  });

  const accent = SUBCAT_ACCENT[slug] ?? FALLBACK_ACCENT;

  return (
    <>
      {/* ── Hero full-bleed ──────────────────────────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-32 pb-16 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-background" />
        {/* Colored glow per subcategory */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className={`h-[380px] w-[700px] rounded-full blur-3xl ${accent.glow}`} />
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground/70">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link href="/academia" className="hover:text-foreground transition-colors">
              Academia
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground/60">{subcat.label}</span>
          </nav>

          {/* Content */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{accent.icon}</span>
              <Badge
                variant="outline"
                className={`px-3 py-1 text-xs uppercase tracking-widest ${accent.badge}`}
              >
                Academia
              </Badge>
            </div>
            <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl">
              {subcat.label}
            </h1>
            {accent.desc && (
              <p className="max-w-xl text-lg text-muted-foreground">{accent.desc}</p>
            )}
            <p className="text-sm text-muted-foreground/60">
              {total} contenido{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid ──────────────────────────────────────────────── */}
      <div className="py-12">
        {posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={`/academia/${slug}`}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <span className="mb-4 text-6xl text-muted-foreground/20">♠</span>
            <p className="text-lg text-muted-foreground">
              No hay contenidos publicados aún.
            </p>
            <Link
              href="/academia"
              className="mt-6 text-sm text-primary hover:underline"
            >
              ← Volver a Academia
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
