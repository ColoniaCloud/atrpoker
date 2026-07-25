"use client";

import { useCallback, useEffect, useState } from "react";
import { ShieldAlert, Loader2, Ban, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReporteModeracion } from "@/lib/types";

function formatDate(value: string): string {
  try {
    const iso = value.includes("T") ? value : value.replace(" ", "T") + "Z";
    return new Date(iso).toLocaleString("es-UY", {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
}

export function ModeracionMensajes() {
  const [reportes, setReportes] = useState<ReporteModeracion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [accionId, setAccionId] = useState<number | null>(null);

  const cargar = useCallback(async () => {
    try {
      const res = await fetch("/api/mensajes/moderacion", { cache: "no-store" });
      setReportes(res.ok ? ((await res.json()) as ReporteModeracion[]) : []);
    } catch {
      setReportes([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function toggleSuspension(r: ReporteModeracion) {
    setAccionId(r.usuario.id);
    try {
      const res = await fetch("/api/mensajes/moderacion/suspender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: r.usuario.id,
          suspender: !r.suspendido,
        }),
      });
      if (res.ok) {
        setReportes((prev) =>
          prev.map((x) =>
            x.usuario.id === r.usuario.id
              ? { ...x, suspendido: !r.suspendido }
              : x
          )
        );
      }
    } finally {
      setAccionId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
        <ShieldAlert className="h-4 w-4 text-rose-400" />
        Moderación de mensajes
      </h2>

      {cargando ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : reportes.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay usuarios reportados. Si el endpoint de WordPress no está
          instalado, esta sección aparece vacía.
        </p>
      ) : (
        <div className="space-y-2">
          {reportes.map((r) => (
            <div
              key={r.usuario.id}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 p-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {r.usuario.nombre}
                  </span>
                  {r.suspendido && (
                    <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-400">
                      Suspendido
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {r.total} reporte{r.total !== 1 ? "s" : ""} · {r.distintos}{" "}
                  usuario{r.distintos !== 1 ? "s" : ""} · {formatDate(r.ultimo_at)}
                </p>
                {r.ultimo_motivo && (
                  <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground/80">
                    “{r.ultimo_motivo}”
                  </p>
                )}
              </div>

              <button
                onClick={() => toggleSuspension(r)}
                disabled={accionId === r.usuario.id}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50",
                  r.suspendido
                    ? "border-border text-foreground hover:border-emerald-500/40 hover:text-emerald-400"
                    : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                )}
              >
                {accionId === r.usuario.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : r.suspendido ? (
                  <RotateCcw className="h-3.5 w-3.5" />
                ) : (
                  <Ban className="h-3.5 w-3.5" />
                )}
                {r.suspendido ? "Reactivar" : "Suspender"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
