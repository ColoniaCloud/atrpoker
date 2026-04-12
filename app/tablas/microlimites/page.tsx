import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { IframePlayer } from "@/components/IframePlayer";

export const metadata: Metadata = {
  title: "Tablas PreFlop · Microlímites",
  description:
    "Tablas de rangos preflop para microlímites NL2/5/10 creadas por Dogthor para ATR Poker.",
};

export default function MicrolimitesPage() {
  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tablas" className="hover:text-foreground transition-colors">Tablas</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/70">Microlímites</span>
      </nav>

      {/* Título */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
          PreFlop · Microlímites
        </span>
        <h1 className="text-4xl font-black text-foreground">
          Tablas NL2/5/10
        </h1>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Las tablas preflop para microlímites son una herramienta clave para desarrollar un juego sólido y consistente desde el inicio.
          En niveles NL2, NL5 y NL10, su función principal es evitar errores comunes y ayudarte a construir buenos hábitos estratégicos.
          Estas tablas indican qué manos abrir o foldear según la posición, priorizando un juego tight y disciplinado que maximiza el valor frente a rivales más pasivos.
          Aplicarlas correctamente te permite mejorar tu winrate, reducir la varianza y sentar las bases para avanzar a límites superiores con confianza.
        </p>
      </div>

      <IframePlayer
        src="https://itch.io/embed-upload/10200969?color=f4f4f4"
        title="Tablas PreFlop Microlímites"
        height={700}
        linkTo="/tablas/mid-stakes"
        linkLabel="Ver tabla Mid-Stakes"
      />
    </div>
  );
}
