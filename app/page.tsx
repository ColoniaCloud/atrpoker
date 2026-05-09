import type { Metadata } from "next";
import { HeroBackgroundVideo } from "@/components/HeroBackgroundVideo";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Spade } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts, getSalas, getCategoryBySlug } from "@/lib/wordpress";
import { CATEGORY_SLUGS, ESCUELA_SUBCATEGORIES } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { SalaCard } from "@/components/SalaCard";
import { SalaPromoCard } from "@/components/SalaPromoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { SalaLogoCarousel } from "@/components/SalaLogoCarousel";
import { SalaIconsWall } from "@/components/SalaIconsWall";
import { HeroSlider } from "@/components/HeroSlider";

export const metadata: Metadata = {
  title: "ATRPoker — Póker Online en Latinoamerica",
  description:
    "Las mejores salas de póker online, reseñas, bonos exclusivos, academia, streaming en vivo y la comunidad de póker más grande de Latinoamerica.",
  alternates: {
    canonical: "https://atrpoker.com",
  },
  openGraph: {
    title: "ATRPoker — Póker Online en Latinoamerica",
    description: "Las mejores salas de póker online, reseñas, bonos exclusivos, academia, streaming en vivo y la comunidad de póker más grande de Latinoamerica.",
    type: "website",
    url: "https://atrpoker.com",
    images: [{
      url: "https://atrpoker.com/brand/Isologotipo.webp",
      width: 1200,
      height: 630,
      alt: "ATRPoker - Póker Online en Latinoamerica",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATRPoker — Póker Online en Latinoamerica",
    description: "Las mejores salas de póker online, reseñas, bonos exclusivos, academia, streaming en vivo y la comunidad de póker más grande de Latinoamerica.",
    images: ["https://atrpoker.com/brand/Isologotipo.webp"],
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const [blogCategory, { items: salasRaw }] = await Promise.all([
    getCategoryBySlug(CATEGORY_SLUGS.BLOG),
    getSalas({ perPage: 20 }),
  ]);

  // Ignition siempre primera como sala destacada
  const salas = [
    ...salasRaw.filter((s) => s.slug === "ignition"),
    ...salasRaw.filter((s) => s.slug !== "ignition"),
  ];

  const { items: blogPosts } = await getPosts({
    perPage: 3,
    categoryId: blogCategory?.id,
  });

  return (
    <>
      {/* ── Hero — full-bleed, pegado al top del viewport ──── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-36 pb-28 bg-gradient-to-b from-zinc-900/70 to-background">
        <HeroBackgroundVideo />

        {/* Glow central */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] lg:h-[600px] lg:w-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-4xl text-center px-4">
          <Badge
            className="mb-6 gap-1.5 px-4 py-1.5 text-sm text-white border-0 bg-transparent hover:bg-transparent"
          >
            <Spade className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-white">Jugá al póker con los mejores y ganá más</span>
          </Badge>

          <HeroSlider />

          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold min-w-[180px]"
            >
              <Link href="/salas">Ver Salas</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link href="/academia">
                Estudiar póker
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Salas destacadas ──────────────────────────────── */}
      <section className="py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Salas de Póker</h2>
            <p className="mt-1 text-muted-foreground">
              Las mejores salas con reseñas y bonos exclusivos
            </p>
          </div>
          {salas.length > 0 && (
            <Button asChild variant="outline" className="hidden sm:flex">
              <Link href="/salas">
                Ver todas <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        {salas.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {salas.map((sala, i) => (
                <SalaCard key={sala.id} sala={sala} index={i} featured={sala.slug === "ignition"} />
              ))}
              <SalaPromoCard />
            </div>
            <div className="mt-6 text-center sm:hidden">
              <Button asChild variant="outline">
                <Link href="/salas">Ver todas las salas</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full" />
            ))}
          </div>
        )}
      </section>

      {/* ── Asesoramiento ─────────────────────────────────── */}
      <section className="py-16 border-b border-border">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
          {/* Imagen */}
          <div className="flex justify-center">
            <Image
              src="/media/fichas.png"
              alt="Asesoramiento ATR Poker"
              width={480}
              height={480}
              className="rounded-2xl object-contain w-full max-w-sm md:max-w-none animate-floating"
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-black text-foreground leading-tight">
              Te asesoramos en{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                tu juego
              </span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Te ayudamos a encontrar la sala ideal para tu estilo de juego, volumen y país.
              Gestionamos tus depósitos y retiros de forma rápida y segura, y nos aseguramos de que
              siempre estés jugando con el máximo rakeback disponible.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Nuestro equipo está disponible para acompañarte en cada paso: desde tu primera cuenta
              hasta optimizar cada centavo que vuelve a tu bankroll.
            </p>

            {/* Botón amber */}
            <div className="relative inline-flex self-start">
              <span className="absolute inset-0 rounded-full bg-amber-500 animate-pulse-ring" />
              <Link
                href="/perfil/asesoramiento"
                className="relative z-10 inline-flex items-center gap-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-6 py-3 transition-colors"
              >
                <ArrowRight className="h-5 w-5 shrink-0" />
                Asesoramiento gratuito
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Academia — CTA + grid de subcategorías ────────── */}
      <section className="py-16 border-b border-border">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[40%_60%] items-start">

          {/* Columna izquierda — 40% */}
          <div className="flex flex-col gap-6">
            <Badge variant="outline" className="self-start border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest">
              Gratis
            </Badge>
            <h2 className="text-3xl font-black text-foreground leading-tight">
              Academia de póker online con{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
                coachs de alto nivel
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              En ATR Póker te damos la posibilidad de acceder a un curso completo de poker online
              creado por coachs ganadores de alto nivel. Además podrás participar del canal de
              Discord donde podrás preguntar lo que quieras.
            </p>
            <Button
              asChild
              size="lg"
              className="self-start bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
            >
              <Link href="/academia">
                Ir a la Academia <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Columna derecha — 60% — grid de subcategorías */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ESCUELA_SUBCATEGORIES.map((sub) => (
              <Link
                key={sub.slug}
                href={`/academia/${sub.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-[hsl(199_60%_12%)] px-6 py-5 transition-colors hover:border-amber-500/60 hover:bg-amber-500/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[hsl(199_60%_14%)] text-muted-foreground group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </span>
                <span className="text-base font-medium text-foreground group-hover:text-amber-400 transition-colors">
                  {sub.label}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Blog ──────────────────────────────────────────── */}
      {blogPosts.length > 0 && (
        <section className="border-t border-border py-16">
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
        </section>
      )}

      {/* ── Sala icons wall ────────────────────────────────── */}
      <SalaIconsWall
        logos={salas
          .map((s) => s.acf?.icono_de_la_sala)
          .filter(
            (ico): ico is { url: string; alt?: string } =>
              typeof ico === "object" && ico !== null && "url" in ico
          )}
      />

      {/* ── Logo carousel — full-bleed ──── */}
      <div className="relative left-1/2 -translate-x-1/2 w-screen">
        <SalaLogoCarousel salas={salas} />
      </div>

      {/* ── Billeteras recomendadas ──────────────────────────── */}
      <section className="py-20">
        <div className="mb-10 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
          >
            Métodos de pago
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            Billeteras recomendadas
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Mové tus fondos rápido y seguro con las plataformas que usan los mejores jugadores de la región
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Bitget ── */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-cyan-500/40 transition-all duration-300 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex flex-col items-center text-center gap-6 p-8 flex-1">
              {/* Logo */}
              <a
                href="https://share.bitget.com/u/H1PVU1TV"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-20 flex items-center justify-center"
              >
                <Image
                  src="/bitget.png"
                  alt="Bitget"
                  width={200}
                  height={72}
                  className="object-contain max-h-full w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              {/* Text */}
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-black text-foreground">Bitget</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Uno de los{" "}
                  <span className="text-foreground/80 font-medium">exchanges cripto más grandes del mundo</span>{" "}
                  con más de 45 millones de usuarios. Recargá y retirá fondos de tus salas de forma rápida, segura y con comisiones mínimas.
                </p>
              </div>

              {/* Feature chips */}
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {["Spot & Futuros", "Copy Trading", "Crypto & Fiat", "KYC simple"].map((f) => (
                  <span
                    key={f}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/10 text-cyan-400 font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://share.bitget.com/u/H1PVU1TV"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold px-6 py-3.5 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                Abrir cuenta en Bitget
              </a>
            </div>
          </div>

          {/* ── LuxonPay ── */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-violet-500/40 transition-all duration-300 flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative flex flex-col items-center text-center gap-6 p-8 flex-1">
              {/* Logo */}
              <a
                href="https://web.luxon.com/register#a_aid=3000020"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-20 flex items-center justify-center"
              >
                <Image
                  src="/luxon.webp"
                  alt="LuxonPay"
                  width={200}
                  height={72}
                  className="object-contain max-h-full w-auto transition-transform duration-300 group-hover:scale-105"
                />
              </a>

              {/* Text */}
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-black text-foreground">LuxonPay</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  La{" "}
                  <span className="text-foreground/80 font-medium">billetera digital creada para jugadores de póker</span>.{" "}
                  Depósitos y retiros instantáneos en las principales salas, soporte dedicado y las mejores tasas de cambio de la región.
                </p>
              </div>

              {/* Feature chips */}
              <div className="flex flex-wrap justify-center gap-2 w-full">
                {["Depósitos instantáneos", "Retiros rápidos", "Soporte 24/7", "Para jugadores"].map((f) => (
                  <span
                    key={f}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-violet-500/25 bg-violet-500/10 text-violet-400 font-medium"
                  >
                    {f}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href="https://web.luxon.com/register#a_aid=3000020"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3.5 transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4 shrink-0" />
                Abrir cuenta en LuxonPay
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
