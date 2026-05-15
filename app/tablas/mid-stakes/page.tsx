import type { Metadata } from "next";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IframePlayer } from "@/components/IframePlayer";

export const metadata: Metadata = {
  title: "Tablas PreFlop · Mid-Stakes",
  description:
    "Tablas de rangos preflop para mid-stakes NL25/50/100/200 creadas por Dogthor para ATR Poker.",
};

export default function MidStakesPage() {
  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/tablas" className="hover:text-foreground transition-colors">Tablas</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground/70">Mid-Stakes</span>
      </nav>

      {/* Título */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 mb-4">
          PreFlop · Mid-Stakes
        </span>
        <h1 className="text-4xl font-black text-foreground">
          Tablas NL25/50/100/200
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Las tablas de poker preflop son una guía esencial para tomar decisiones óptimas antes del flop.
          En niveles Mid-Stakes (NL25/50 a NL100/200), se utilizan para mantener un rango equilibrado y explotar errores comunes de los rivales.
          Estas tablas indican qué manos abrir, pagar o resubir desde cada posición, pero deben adaptarse al estilo de la mesa, la dinámica del rival y el tamaño de los stacks.
          Su objetivo es reducir errores preflop y construir bases sólidas para decisiones más complejas postflop, manteniendo siempre una estrategia flexible y ajustada al contexto.
        </p>
      </div>

      <IframePlayer
        src="https://itch.io/embed-upload/8676062?color=333333"
        title="Tablas PreFlop Mid-Stakes"
        height={700}
        linkTo="/tablas/microlimites"
        linkLabel="Ver tabla Microlímites"
      />
    </div>
  );
}
