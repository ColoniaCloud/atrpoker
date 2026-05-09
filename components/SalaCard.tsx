"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Eye } from "lucide-react";
import type { WPSala } from "@/lib/types";
import { stripHtml } from "@/lib/wordpress";
import { SalaJugaModal } from "@/components/SalaJugaModal";

interface LogoObject {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface SalaCardProps {
  sala: WPSala;
  index?: number;
  featured?: boolean;
}

const ESTADO_STYLES: Record<string, string> = {
  activa: "bg-green-500/10 text-green-400 border-green-500/20",
  inactiva: "bg-red-500/10 text-red-400 border-red-500/20",
  mantenimiento: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

const ESTADO_LABELS: Record<string, string> = {
  activa: "Activa",
  inactiva: "Inactiva",
  mantenimiento: "Mantenimiento",
};

export function SalaCard({ sala, index = 0, featured = false }: SalaCardProps) {
  const { acf } = sala;
  const salaName = stripHtml(sala.title.rendered);

  const logo =
    acf?.logo_entero && typeof acf.logo_entero === "object"
      ? (acf.logo_entero as LogoObject)
      : null;

  const rakeback = acf?.rakeback ? String(acf.rakeback).trim() : null;
  const red = acf?.red?.trim() || null;
  const bonificacion = acf?.bonificacion?.trim() || null;
  const estado = acf?.estado || null;
  const deposito = acf?.deposito_minimo ? String(acf.deposito_minimo).trim() : null;
  const description = stripHtml(sala.excerpt?.rendered ?? "").trim();

  const delay = `${index * 60}ms`;

  return (
    <div
      className={`group h-full rounded-2xl border bg-card overflow-hidden flex flex-col animate-fade-up transition-colors duration-300 ${featured ? "border-amber-400/70 animate-border-glow shadow-[0_0_16px_rgba(251,191,36,0.18)]" : "border-border hover:border-amber-500/40"}`}
      style={{ animationDelay: delay }}
    >
      {/* Logo / cabecera */}
      <Link
        href={`/salas/${sala.slug}`}
        className="flex items-center justify-center h-32 px-6 bg-zinc-900/60 border-b border-border hover:bg-zinc-900/80 transition-colors"
        title={salaName}
      >
        {logo ? (
          <Image
            src={logo.url}
            alt={logo.alt || salaName}
            width={logo.width || 200}
            height={logo.height || 80}
            className="object-contain max-h-20 w-auto max-w-[180px] transition-transform duration-300 group-hover:scale-105"
            draggable={false}
          />
        ) : (
          <span className="text-lg font-black text-foreground/60 text-center leading-tight">
            {salaName}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        {/* Estado + red */}
        <div className="flex flex-wrap items-center gap-1.5">
          {estado && ESTADO_STYLES[estado] && (
            <span
              className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${ESTADO_STYLES[estado]}`}
            >
              {estado === "activa" && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
              )}
              {ESTADO_LABELS[estado] ?? estado}
            </span>
          )}
          {red && (
            <span className="inline-flex items-center rounded-sm border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              {red}
            </span>
          )}
        </div>

        {/* Descripción corta */}
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>
        )}

        {/* Rakeback */}
        {rakeback && (
          <div className="flex items-baseline gap-1.5">
            <span className="font-oswald text-xl sm:text-2xl font-semibold text-amber-400 leading-none">
              {rakeback}
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              rakeback ATR
            </span>
          </div>
        )}

        {/* Bonificación */}
        {bonificacion && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            <span className="font-medium text-foreground/60">Bono:</span>{" "}
            {bonificacion}
          </p>
        )}

        {/* Depósito mínimo */}
        {deposito && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground/70">Depósito mín.:</span>{" "}
            {deposito}
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 p-4 pt-0">
        <Link
          href={`/salas/${sala.slug}`}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent hover:bg-muted text-foreground/70 hover:text-foreground font-semibold text-xs py-2.5 transition-colors duration-200"
        >
          <Eye className="h-3.5 w-3.5" />
          VER SALA
        </Link>

        <SalaJugaModal
          salaName={salaName}
          logo={logo}
          instrucciones={acf?.instrucciones}
          linkAfiliado={acf?.link_de_afiliado}
          codigoAfiliado={acf?.codigo_de_afiliado}
          codigoBonificacion={acf?.codigo_de_bonificacion}
          web={acf?.web}
          renderTrigger={(onClick) => (
            <button
              onClick={onClick}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 transition-colors duration-200"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              JUGÁ AHORA
            </button>
          )}
        />
      </div>
    </div>
  );
}
