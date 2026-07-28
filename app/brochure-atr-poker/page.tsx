import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Percent,
  GraduationCap,
  Target,
  Table2,
  Wallet,
  Gift,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSalas } from "@/lib/wordpress";

export const metadata: Metadata = {
  title: "Brochure ATR Poker",
  description:
    "ATR Poker es una academia de poker profesional enfocada en la formación integral de jugadores. Rakeback exclusivo, academia, coaching y agentes ATR.",
  alternates: {
    canonical: "https://atrpoker.com/brochure-atr-poker",
  },
};

export const revalidate = 3600;

const BENEFICIOS = [
  {
    icon: Percent,
    title: "Rakeback exclusivo ATR",
    desc: "Obtén un beneficio extra por parte de la academia.",
  },
  {
    icon: GraduationCap,
    title: "Academia ATR",
    desc: "Acceso completo a más de 120hs de contenido educativo de teoría y práctica.",
  },
  {
    icon: Target,
    title: "Coaching de CASH y MTT",
    desc: "Clases y coaching privado exclusivos de ATR.",
  },
  {
    icon: Table2,
    title: "Tablas PreFlop",
    desc: "Para que consultes cuando las necesites.",
  },
  {
    icon: Wallet,
    title: "Depósitos y retiros",
    desc: "Sin comisión y al instante en nuestra cuenta cajero.",
  },
  {
    icon: Gift,
    title: "Puntos ATR de bienvenida",
    desc: "Realizá un depósito y comenzá a descargar el contenido premium y exclusivo de la academia.",
  },
  {
    icon: Handshake,
    title: "Agentes ATR",
    desc: "Oportunidad de ser Agente o Subagente ATR.",
  },
] as const;

// Salas que aparecen en el brochure y siguen vigentes en el catálogo actual
const BROCHURE_SALAS_SLUGS = [
  "wpt-world-poker-tour",
  "coin-poker",
  "acr-poker",
  "poker-king",
  "champion-poker",
];

export default async function BrochurePage() {
  const { items: salasRaw } = await getSalas({ perPage: 20 });
  const salas = BROCHURE_SALAS_SLUGS.map((slug) => salasRaw.find((s) => s.slug === slug)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s)
  );

  return (
    <div className="py-16">
      {/* ── Intro ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl text-center">
        <Badge
          variant="outline"
          className="mb-4 border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
        >
          Brochure
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground leading-tight">
          ¿Qué es{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
            ATR Poker
          </span>
          ?
        </h1>
        <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
          ATR Poker es una academia de poker profesional enfocada en la formación integral de
          jugadores.
        </p>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Nuestro objetivo es acompañarte en tu crecimiento dentro y fuera de las mesas,
          ofreciéndote herramientas, contenidos y soporte personalizado para que puedas mejorar tu
          rendimiento y alcanzar resultados reales.
        </p>
      </section>

      {/* ── Principales beneficios ───────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-center text-3xl font-black text-foreground leading-tight mb-10">
          Principales beneficios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENEFICIOS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-bold text-foreground leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Salas disponibles ─────────────────────────────────── */}
      {salas.length > 0 && (
        <section className="mt-20">
          <h2 className="text-center text-3xl font-black text-foreground leading-tight mb-10">
            Salas disponibles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {salas.map((sala) => {
              const logo =
                sala.acf?.logo_entero && typeof sala.acf.logo_entero === "object"
                  ? sala.acf.logo_entero
                  : null;
              return (
                <Link
                  key={sala.slug}
                  href={`/salas/${sala.slug}`}
                  className="flex h-24 items-center justify-center rounded-2xl border border-border bg-card px-6 transition-colors hover:border-amber-500/40"
                >
                  {logo ? (
                    <Image
                      src={logo.url}
                      alt={logo.alt || sala.title.rendered}
                      width={logo.width || 160}
                      height={logo.height || 60}
                      className="h-auto max-h-14 w-auto max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-sm font-bold text-foreground/70">
                      {sala.title.rendered}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Cómo funciona ─────────────────────────────────────── */}
      <section className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-black text-xl text-foreground mb-3">Puntos ATR</h3>
          <p className="text-muted-foreground leading-relaxed">
            A medida que vas jugando vas generando puntos que podrás utilizar para descargar el
            contenido exclusivo de la academia.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8">
          <h3 className="font-black text-xl text-foreground mb-3">Todos los beneficios</h3>
          <p className="text-muted-foreground leading-relaxed">
            Aplican únicamente para cuentas nuevas creadas a través de ATR Poker.
          </p>
        </div>
      </section>

      {/* ── Por qué elegir ATR ────────────────────────────────── */}
      <section className="mt-20 mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-black text-foreground leading-tight mb-6">
          ¿Por qué elegir{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
            ATR
          </span>
          ?
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Porque no solo te damos un enlace, te acompañamos en tu progreso. En ATR Poker jugás,
          estudiás y crecés junto a una comunidad activa de jugadores que buscan mejorar su juego
          día a día, con el respaldo de un equipo profesional.
        </p>
      </section>

      {/* ── CTA final ─────────────────────────────────────────── */}
      <section className="mt-20 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-transparent px-6 py-14 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
          ¿Estás list@?
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-muted-foreground text-lg leading-relaxed">
          Únete hoy a la academia de póker que da más beneficios, te acompaña y te quiere ver
          crecer. Sumate a un grupo de amigos que comparten la misma pasión que vos.
        </p>

        <div className="mt-10 mx-auto max-w-md text-left rounded-xl border border-border bg-card p-6">
          <h3 className="font-black text-lg text-foreground mb-1">Registro web</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Seguí estos pasos para completar tu registro y disfrutar automáticamente de los
            beneficios de ATR Poker.
          </p>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-bold text-foreground">1 —</span>{" "}
              <Link href="/registro" className="text-amber-400 hover:underline">
                Creá tu cuenta de ATR acá
              </Link>
            </li>
            <li>
              <span className="font-bold text-foreground">2 —</span> Dirigite a la sección{" "}
              <Link href="/salas" className="text-amber-400 hover:underline">
                Salas
              </Link>{" "}
              y elegí la que más se adapte a vos. Es importante seguir el link de la sala: es lo
              que nos permite otorgarte los beneficios.
            </li>
          </ol>
        </div>

        <Button
          asChild
          size="lg"
          className="mt-8 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold min-w-[220px]"
        >
          <Link href="/registro">
            Registrate <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
