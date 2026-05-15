"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, ExternalLink, HelpCircle, Gem, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/CopyButton";

interface LogoObject {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface SalaJugaModalProps {
  salaName: string;
  logo?: LogoObject | null;
  instrucciones?: string;
  linkAfiliado?: string;
  codigoAfiliado?: string;
  codigoBonificacion?: string;
  web?: string;
  /**
   * Trigger personalizado. Recibe el handler onClick.
   * Si no se provee, renderiza el botón "JUGÁ AHORA" por defecto.
   */
  renderTrigger?: (onClick: () => void) => React.ReactNode;
}

const WA_NUMBER = "5491124932724";

export function SalaJugaModal({
  salaName,
  logo,
  instrucciones,
  linkAfiliado,
  codigoAfiliado,
  codigoBonificacion,
  web,
  renderTrigger,
}: SalaJugaModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const waMessage = encodeURIComponent(`Necesito ayuda para jugar en ${salaName}`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  const modal = (
    <div className="fixed inset-0 z-overlay flex items-start justify-center overflow-y-auto px-3 sm:px-4 pt-12 sm:pt-24 pb-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-zinc-950/85 backdrop-blur-md"
        onClick={() => setOpen(false)}
      />

      {/* Dialog */}
      <div className="relative z-modal w-full max-w-[calc(100vw-24px)] sm:max-w-lg rounded-2xl border border-border bg-card shadow-2xl">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-8">
          {/* Logo */}
          {logo && (
            <div className="mb-6 flex justify-center">
              <Image
                src={logo.url}
                alt={logo.alt || salaName}
                width={logo.width || 200}
                height={logo.height || 80}
                className="object-contain max-h-20 w-auto"
                style={{ maxWidth: 220 }}
              />
            </div>
          )}

          {/* Instrucciones HTML */}
          {instrucciones ? (
            <div
              className="wp-content prose prose-invert prose-sm max-w-none mb-6 text-foreground/90"
              dangerouslySetInnerHTML={{ __html: instrucciones }}
            />
          ) : (
            <p className="mb-6 text-center text-muted-foreground text-sm">
              Hacé clic en &quot;Crear cuenta&quot; para registrarte en {salaName} y obtener tu rakeback con ATR.
            </p>
          )}

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            {linkAfiliado ? (
              <a
                href={linkAfiliado}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-6 py-3.5 text-sm transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                CREAR CUENTA
              </a>
            ) : (
              <span className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-muted text-muted-foreground font-bold px-6 py-3.5 text-sm cursor-not-allowed">
                <ExternalLink className="h-4 w-4" />
                CREAR CUENTA
              </span>
            )}

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-green-500/50 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold px-6 py-3.5 text-sm transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              CONTACTAR
            </a>
          </div>

          {/* Barra de dirección simulada */}
          {web && (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <div className="flex gap-1.5 flex-shrink-0">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
              </div>
              <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-1.5 min-w-0">
                <Globe className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 truncate font-mono text-xs text-muted-foreground select-none">
                  {web}
                </span>
              </div>
              {linkAfiliado && (
                <a
                  href={linkAfiliado}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="h-3 w-3" />
                  Ir a la web
                </a>
              )}
            </div>
          )}

          {/* Botones copiar códigos */}
          {(codigoAfiliado || codigoBonificacion) && (
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              {codigoAfiliado && (
                <CopyButton
                  value={codigoAfiliado}
                  label="Cód. afiliado:"
                  className="flex-1 py-3"
                />
              )}
              {codigoBonificacion && (
                <CopyButton
                  value={codigoBonificacion}
                  label="Cód. bono:"
                  className="flex-1 py-3"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {renderTrigger ? (
        renderTrigger(() => setOpen(true))
      ) : (
        /* Botón por defecto con pulse ring */
        <div className="relative inline-flex">
          <span className="absolute inset-0 rounded-lg bg-primary animate-pulse-ring" />
          <Button
            size="lg"
            className="relative bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black min-w-[220px] gap-2 h-14 text-base px-8"
            onClick={() => setOpen(true)}
          >
            <Gem className="h-5 w-5" />
            JUGÁ AHORA
          </Button>
        </div>
      )}

      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
