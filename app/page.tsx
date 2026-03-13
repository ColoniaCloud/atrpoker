import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts, getSalas, getCategoryBySlug, getFeaturedImageUrl, stripHtml } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { SalaCard } from "@/components/SalaCard";

export const metadata: Metadata = {
  title: "ATRPoker — Póker Online en Uruguay",
  description:
    "Las mejores salas de póker online, reseñas, bonos exclusivos, streaming en vivo y la comunidad de póker más grande de Uruguay.",
};

export const revalidate = 300;

export default async function HomePage() {
  // Cargamos en paralelo las últimas entradas de blog y las salas destacadas
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 py-24 px-4">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-500 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-900/50 border border-brand-800 text-brand-300 text-sm font-medium mb-6">
            <span className="text-gold-400">♠</span>
            Comunidad de Póker Online en Uruguay
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Tu guía de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-gold-400">
              póker online
            </span>{" "}
            en Uruguay
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Reseñas honestas de salas, bonos exclusivos, estrategia avanzada y streaming en vivo. Todo lo que necesitás para jugar mejor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/salas" className="btn-gold">
              Ver salas de póker
            </Link>
            <Link href="/streaming" className="btn-outline">
              Ver streams en vivo
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-zinc-800 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: `${salas.length}+`, label: "Salas analizadas" },
              { value: "100%", label: "Reseñas honestas" },
              { value: "♠♣♥♦", label: "Todas las variantes" },
              { value: "24/7", label: "Streaming disponible" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-black text-gold-400">{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salas destacadas */}
      {salas.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Salas de Póker</h2>
                <p className="text-zinc-400 mt-1">Las mejores salas con reseñas y bonos exclusivos</p>
              </div>
              <Link href="/salas" className="btn-outline hidden sm:inline-flex">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {salas.map((sala) => (
                <SalaCard key={sala.id} sala={sala} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link href="/salas" className="btn-outline">Ver todas las salas</Link>
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="py-16 px-4 border-t border-zinc-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-white">Últimas del Blog</h2>
                <p className="text-zinc-400 mt-1">Estrategia, noticias y análisis de póker</p>
              </div>
              <Link href="/blog" className="btn-outline hidden sm:inline-flex">
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Link href="/blog" className="btn-outline">Ver todo el blog</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Streaming */}
      <section className="py-16 px-4 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-medium mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            Streaming disponible
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Mirá las mejores mesas en vivo
          </h2>
          <p className="text-zinc-400 mb-8">
            Accedé al streaming exclusivo de torneos y cash games. Disponible para miembros registrados.
          </p>
          <Link href="/streaming" className="btn-primary">
            Ir al Streaming
          </Link>
        </div>
      </section>
    </>
  );
}
