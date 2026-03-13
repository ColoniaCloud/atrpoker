import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPosts, getSalas, getCategoryBySlug } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { SalaCard } from "@/components/SalaCard";

export const metadata: Metadata = {
  title: "ATRPoker — Póker Online en Uruguay",
  description:
    "Las mejores salas de póker online, reseñas, bonos exclusivos, academia, streaming en vivo y la comunidad de póker más grande de Uruguay.",
};

export const revalidate = 300;

const STATS = [
  { value: "8+", label: "Salas analizadas" },
  { value: "100%", label: "Reseñas honestas" },
  { value: "♠♣♥♦", label: "Todas las variantes" },
  { value: "24/7", label: "Streaming disponible" },
];

export default async function HomePage() {
  const [blogCategory, { items: salas }] = await Promise.all([
    getCategoryBySlug(CATEGORY_SLUGS.BLOG),
    getSalas({ perPage: 4 }),
  ]);

  const { items: blogPosts } = await getPosts({
    perPage: 3,
    categoryId: blogCategory?.id,
  });

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-b from-zinc-900 to-background">
        {/* Glow de fondo */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="mb-6 gap-1.5 px-4 py-1.5 text-sm border-primary/30 text-primary">
            <span className="text-amber-400">♠</span>
            Comunidad de Póker Online en Uruguay
          </Badge>

          <h1 className="mb-6 text-5xl font-black leading-tight text-foreground md:text-6xl">
            Tu guía de{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              póker online
            </span>{" "}
            en Uruguay
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
            Reseñas honestas de salas, bonos exclusivos, academia de póker, coaches privados y streaming en vivo.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold min-w-[180px]"
            >
              <Link href="/salas">Ver salas de póker</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link href="/streaming">
                <Radio className="mr-2 h-4 w-4" />
                Streaming en vivo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-card py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <div className="text-3xl font-black text-amber-400">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                {i < STATS.length - 1 && (
                  <Separator orientation="vertical" className="absolute hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Salas destacadas ──────────────────────────────── */}
      {salas.length > 0 && (
        <section className="py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Salas de Póker</h2>
                <p className="mt-1 text-muted-foreground">
                  Las mejores salas con reseñas y bonos exclusivos
                </p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link href="/salas">
                  Ver todas <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {salas.map((sala) => (
                <SalaCard key={sala.id} sala={sala} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline">
                <Link href="/salas">Ver todas las salas</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── Blog ──────────────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="border-t border-border py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Últimas del Blog</h2>
                <p className="mt-1 text-muted-foreground">
                  Estrategia, noticias y análisis de póker
                </p>
              </div>
              <Button asChild variant="outline" className="hidden sm:flex">
                <Link href="/blog">
                  Ver todo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline">
                <Link href="/blog">Ver todo el blog</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Streaming ─────────────────────────────────── */}
      <section className="border-t border-border py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="destructive" className="mb-6 gap-1.5 px-4 py-1.5 text-sm animate-pulse">
            <span className="h-2 w-2 rounded-full bg-white" />
            Streaming disponible
          </Badge>
          <h2 className="mb-4 text-3xl font-bold text-foreground">
            Mirá las mejores mesas en vivo
          </h2>
          <p className="mb-8 text-muted-foreground">
            Accedé al streaming exclusivo de torneos y cash games. Disponible para miembros registrados.
          </p>
          <Button asChild size="lg">
            <Link href="/streaming">
              Ir al Streaming <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
