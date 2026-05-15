import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "¿Cómo usar las tablas PreFlop? | ATRPoker",
  description:
    "Guía paso a paso para entender y aplicar las tablas de rangos preflop de ATRPoker en tus partidas.",
};

const STEPS = [
  {
    num: "01",
    title: "Identificá tu posición en la mesa",
    body: "Las tablas están organizadas por posición: UTG (Under The Gun), MP (Middle Position), CO (Cutoff), BTN (Button), SB (Small Blind) y BB (Big Blind). Antes de mirar cualquier rango, ubicá exactamente desde dónde vas a actuar.",
    tip: "El BTN es la posición más poderosa. Cuanto más tarde actuás, más manos podés abrir.",
  },
  {
    num: "02",
    title: "Elegí la situación correcta",
    body: "Cada tabla cubre una situación distinta: apertura (RFI), respuesta a un raise (vs RFI), respuesta a un 3-bet, y así. Nunca uses la tabla de aperturas para decidir si llamar un 3-bet; son rangos independientes.",
    tip: "Las siglas más comunes: RFI (Raise First In), 3B (3-Bet), CC (Cold Call), SQ (Squeeze).",
  },
  {
    num: "03",
    title: "Leé el código de color de cada mano",
    body: "Las manos se muestran en una grilla 13×13. Los colores indican la acción recomendada: verde = abrir/apostar, azul = llamar, rojo = fold, y tonos intermedios = frecuencia mixta (jugás esa mano un porcentaje del tiempo).",
    tip: "Las frecuencias mixtas existen para mantenerte imbalanceado y difícil de leer para tus rivales.",
  },
  {
    num: "04",
    title: "Ajustá al contexto de la mesa",
    body: "Las tablas son un punto de partida, no una ley. Si la mesa es muy pasiva, podés ampliar rangos. Si hay un 3-bettor agresivo a tu izquierda, cerrás un poco. Las tablas te dan el baseline; la lectura en vivo te da el ajuste.",
    tip: "Empezá jugando las tablas al pie de la letra. Solo ajustá cuando entiendas bien por qué hacés cada ajuste.",
  },
];

const GLOSS = [
  { term: "RFI",    def: "Raise First In — apertura de bote sin raises previos." },
  { term: "3-Bet",  def: "Segunda subida en una misma calle." },
  { term: "4-Bet",  def: "Tercera subida. Rango muy polarizado: value o bluff." },
  { term: "BTN",    def: "Button — posición más tardía y más poderosa." },
  { term: "BB",     def: "Big Blind — paga la ciega grande, actúa último preflop." },
  { term: "IP",     def: "In Position — actuás después que tu rival en cada calle." },
  { term: "OOP",    def: "Out Of Position — actuás antes que tu rival." },
  { term: "SPR",    def: "Stack-to-Pot Ratio — cuántas veces el pot caben en el stack efectivo." },
];

export default function ComoUsarPage() {
  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-10 flex items-center gap-1.5 text-sm text-muted-foreground/70">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <Link href="/tablas" className="hover:text-foreground transition-colors">Tablas</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-foreground/60">¿Cómo usar las tablas?</span>
      </nav>

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="mb-14 max-w-2xl">
        <Badge
          variant="outline"
          className="mb-5 border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
        >
          Guía de uso
        </Badge>
        <h1 className="mb-4 text-4xl font-black leading-tight text-foreground md:text-5xl">
          ¿Cómo usar las{" "}
          <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
            tablas preflop?
          </span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Las tablas de rangos preflop son la base de cualquier estrategia sólida. Esta guía te
          explica en 4 pasos cómo leerlas y aplicarlas correctamente en tus partidas.
        </p>
      </div>

      {/* ── Steps ────────────────────────────────────────────── */}
      <div className="mb-16 space-y-6">
        {STEPS.map((step, i) => (
          <div
            key={step.num}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-colors duration-300 hover:border-amber-500/30"
          >
            {/* Step number background */}
            <span
              className="pointer-events-none absolute right-6 top-4 select-none text-[7rem] font-black leading-none text-foreground/[0.03]"
              aria-hidden
            >
              {step.num}
            </span>

            <div className="relative flex flex-col gap-4 sm:flex-row sm:gap-8">
              {/* Number badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 font-black text-sm">
                {step.num}
              </div>

              <div className="flex flex-col gap-3">
                <h2 className="text-xl font-bold text-foreground leading-tight">
                  {step.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
                {/* Tip */}
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                  <span className="mt-0.5 shrink-0 text-amber-400 text-xs font-black uppercase tracking-wider">
                    Tip
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.tip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Glosario ─────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-foreground">Glosario básico</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {GLOSS.map((g) => (
            <div
              key={g.term}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4"
            >
              <span className="shrink-0 rounded-md bg-amber-500/15 px-2 py-0.5 text-xs font-black text-amber-400 leading-5">
                {g.term}
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.def}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8">
        <h2 className="mb-2 text-xl font-bold text-foreground">¿Listo para practicar?</h2>
        <p className="mb-6 text-muted-foreground">
          Accedé a las tablas interactivas y empezá a entrenar tus rangos preflop ahora mismo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/tablas/microlimites"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-2.5 text-sm transition-colors"
          >
            Tabla Microlímites <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/tablas/mid-stakes"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card hover:border-foreground/30 text-foreground font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Tabla Mid-Stakes <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
