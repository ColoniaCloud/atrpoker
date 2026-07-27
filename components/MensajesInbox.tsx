"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Send,
  Search,
  ArrowLeft,
  Ban,
  Flag,
  Loader2,
  MessagesSquare,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  ConversacionResumen,
  HiloRespuesta,
  Mensaje,
  UsuarioPublico,
} from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatHora(iso: string): string {
  const d = new Date(iso.includes("Z") || iso.includes("T") ? iso : iso.replace(" ", "T") + "Z");
  const hoy = new Date();
  const mismoDia = d.toDateString() === hoy.toDateString();
  if (mismoDia) {
    return d.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" });
}

function Avatar({ user, size = 40 }: { user: UsuarioPublico; size?: number }) {
  const inicial = user.nombre?.trim().charAt(0).toUpperCase() || "?";
  return user.avatar ? (
    <Image
      src={user.avatar}
      alt={user.nombre}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
      unoptimized
    />
  ) : (
    <span
      className="flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 font-black text-zinc-950"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {inicial}
    </span>
  );
}

type Tab = "bandeja" | "solicitudes";

// ─── Componente ──────────────────────────────────────────────────────────────

export function MensajesInbox() {
  const [tab, setTab] = useState<Tab>("bandeja");
  const [bandeja, setBandeja] = useState<ConversacionResumen[]>([]);
  const [solicitudes, setSolicitudes] = useState<ConversacionResumen[]>([]);
  const [cargandoListas, setCargandoListas] = useState(true);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [hilo, setHilo] = useState<HiloRespuesta | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [cargandoHilo, setCargandoHilo] = useState(false);

  const [draft, setDraft] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Búsqueda de usuarios
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<UsuarioPublico[]>([]);
  const [buscando, setBuscando] = useState(false);

  const finRef = useRef<HTMLDivElement | null>(null);
  const activeIdRef = useRef<number | null>(null);
  activeIdRef.current = activeId;

  // ── Fetch listas ───────────────────────────────────────────────────────────

  const fetchListas = useCallback(async () => {
    try {
      const [b, s] = await Promise.all([
        fetch("/api/mensajes/conversaciones", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : []
        ),
        fetch("/api/mensajes/solicitudes", { cache: "no-store" }).then((r) =>
          r.ok ? r.json() : []
        ),
      ]);
      setBandeja(b as ConversacionResumen[]);
      setSolicitudes(s as ConversacionResumen[]);
    } catch {
      // mantener lo que había
    } finally {
      setCargandoListas(false);
    }
  }, []);

  useEffect(() => {
    fetchListas();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchListas();
    }, 20000);
    return () => clearInterval(id);
  }, [fetchListas]);

  // ── Abrir conversación ───────────────────────────────────────────────────

  const abrirHilo = useCallback(async (convId: number) => {
    setActiveId(convId);
    setCargandoHilo(true);
    setError(null);
    setMensajes([]);
    setHilo(null);
    try {
      const res = await fetch(`/api/mensajes/conversaciones/${convId}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        setError("No se pudo abrir la conversación");
        return;
      }
      const data = (await res.json()) as HiloRespuesta;
      setHilo(data);
      setMensajes(data.mensajes);
      // marcar leído (no bloqueante)
      fetch(`/api/mensajes/conversaciones/${convId}/leido`, { method: "POST" }).catch(
        () => {}
      );
      // limpiar contador local
      setBandeja((prev) =>
        prev.map((c) => (c.id === convId ? { ...c, no_leidos: 0 } : c))
      );
    } finally {
      setCargandoHilo(false);
    }
  }, []);

  // ── Polling incremental del hilo abierto ─────────────────────────────────

  useEffect(() => {
    if (!activeId) return;
    const id = setInterval(async () => {
      if (document.visibilityState !== "visible") return;
      const ultimoId = mensajes.length ? mensajes[mensajes.length - 1].id : 0;
      try {
        const res = await fetch(
          `/api/mensajes/conversaciones/${activeId}?after=${ultimoId}`,
          { cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as HiloRespuesta;
        if (activeIdRef.current !== activeId) return;
        if (data.mensajes.length > 0) {
          setMensajes((prev) => [...prev, ...data.mensajes]);
          fetch(`/api/mensajes/conversaciones/${activeId}/leido`, {
            method: "POST",
          }).catch(() => {});
        }
      } catch {
        // reintenta en el próximo tick
      }
    }, 10000);
    return () => clearInterval(id);
  }, [activeId, mensajes]);

  // scroll al fondo cuando llegan mensajes
  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  // ── Enviar ────────────────────────────────────────────────────────────────

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const cuerpo = draft.trim();
    if (!cuerpo || !activeId || enviando) return;
    setEnviando(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/mensajes/conversaciones/${activeId}/mensajes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cuerpo }),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError((data as { error?: string })?.error ?? "No se pudo enviar");
        return;
      }
      setMensajes((prev) => [...prev, data as Mensaje]);
      setDraft("");
      // si era una solicitud que yo respondí, refrescar listas
      fetchListas();
    } finally {
      setEnviando(false);
    }
  }

  // ── Acciones de moderación ───────────────────────────────────────────────

  async function accion(
    path: string,
    body?: unknown
  ): Promise<boolean> {
    if (!activeId) return false;
    try {
      const res = await fetch(`/api/mensajes/conversaciones/${activeId}/${path}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function aceptar() {
    if (await accion("aceptar")) {
      await fetchListas();
      if (activeId) abrirHilo(activeId);
      setTab("bandeja");
    }
  }

  async function bloquear() {
    const ok = await accion("bloquear", { bloquear: !hilo?.conversacion.bloqueado });
    if (ok && activeId) abrirHilo(activeId);
  }

  async function reportar() {
    if (await accion("reportar", { motivo: "" })) {
      setError("Reporte enviado. Gracias por avisar.");
    }
  }

  // ── Búsqueda de usuarios (debounced) ─────────────────────────────────────

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/usuarios/buscar?q=${encodeURIComponent(q)}`, {
          cache: "no-store",
        });
        setResultados(res.ok ? ((await res.json()) as UsuarioPublico[]) : []);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [query]);

  async function iniciarConversacion(u: UsuarioPublico) {
    setError(null);
    try {
      const res = await fetch("/api/mensajes/conversaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destinatario_id: u.id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError((data as { error?: string })?.error ?? "No se pudo iniciar");
        return;
      }
      setQuery("");
      setResultados([]);
      await fetchListas();
      abrirHilo((data as { id: number }).id);
    } catch {
      setError("Error de red");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const listaActiva = tab === "bandeja" ? bandeja : solicitudes;

  return (
    <div className="grid h-[calc(100vh-16rem)] min-h-[520px] grid-cols-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[320px_1fr]">
      {/* ── Panel izquierdo: listas ──────────────────────────────────────── */}
      <aside
        className={cn(
          "flex flex-col border-r border-border",
          activeId !== null && "hidden md:flex"
        )}
      >
        {/* Buscador */}
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar usuario…"
              className="w-full rounded-xl border border-border bg-muted/30 py-2 pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-amber-500/40"
            />
          </div>
          {query.trim().length >= 2 && (
            <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-border bg-background">
              {buscando ? (
                <div className="flex items-center justify-center py-4 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : resultados.length === 0 ? (
                <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                  Sin resultados
                </p>
              ) : (
                resultados.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => iniciarConversacion(u)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted"
                  >
                    <Avatar user={u} size={32} />
                    <span className="truncate text-sm text-foreground">{u.nombre}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {(["bandeja", "solicitudes"] as Tab[]).map((t) => {
            const n = t === "solicitudes" ? solicitudes.length : 0;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                  tab === t
                    ? "border-b-2 border-amber-500 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t === "bandeja" ? "Bandeja" : "Solicitudes"}
                {n > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-[10px] font-black text-zinc-950">
                    {n}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto">
          {cargandoListas ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : listaActiva.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
              <MessagesSquare className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {tab === "bandeja"
                  ? "No tenés conversaciones todavía"
                  : "No tenés solicitudes"}
              </p>
            </div>
          ) : (
            listaActiva.map((c) => (
              <button
                key={c.id}
                onClick={() => abrirHilo(c.id)}
                className={cn(
                  "flex w-full items-center gap-3 border-b border-border/50 px-3 py-3 text-left transition-colors hover:bg-muted/50",
                  activeId === c.id && "bg-muted/40"
                )}
              >
                <Avatar user={c.con} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {c.con.nombre}
                      </span>
                      {tab === "bandeja" && c.estado === "pendiente" && c.inicie_yo && (
                        <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Pendiente
                        </span>
                      )}
                    </span>
                    {c.ultimo_mensaje && (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatHora(c.ultimo_mensaje.creado_at)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                      {c.ultimo_mensaje
                        ? (c.ultimo_mensaje.mio ? "Vos: " : "") + c.ultimo_mensaje.cuerpo
                        : "Sin mensajes"}
                    </span>
                    {c.no_leidos > 0 && (
                      <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-zinc-950">
                        {c.no_leidos}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* ── Panel derecho: hilo ──────────────────────────────────────────── */}
      <section
        className={cn(
          "flex flex-col",
          activeId === null && "hidden md:flex"
        )}
      >
        {activeId === null ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <MessagesSquare className="h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Elegí una conversación o buscá un usuario para empezar
            </p>
          </div>
        ) : (
          <>
            {/* Cabecera */}
            <div className="flex items-center gap-3 border-b border-border p-3">
              <button
                onClick={() => {
                  setActiveId(null);
                  setHilo(null);
                }}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
                aria-label="Volver"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              {hilo && <Avatar user={hilo.conversacion.con} size={36} />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {hilo?.conversacion.con.nombre ?? "…"}
                </p>
                {hilo?.conversacion.estado === "pendiente" && (
                  <p className="text-[11px] text-amber-400">
                    {hilo.conversacion.inicie_yo
                      ? "Solicitud enviada"
                      : "Solicitud de mensaje"}
                  </p>
                )}
              </div>
              {hilo && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={reportar}
                    title="Reportar"
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                  <button
                    onClick={bloquear}
                    title={hilo.conversacion.bloqueado ? "Desbloquear" : "Bloquear"}
                    className={cn(
                      "rounded-lg p-1.5 transition-colors hover:bg-muted",
                      hilo.conversacion.bloqueado
                        ? "text-red-400"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mensajes */}
            <div className="flex-1 space-y-2 overflow-y-auto p-4">
              {cargandoHilo ? (
                <div className="flex items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : mensajes.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Escribí el primer mensaje
                </p>
              ) : (
                mensajes.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex", m.mio ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
                        m.mio
                          ? "rounded-br-sm bg-amber-500 text-zinc-950"
                          : "rounded-bl-sm bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.cuerpo}</p>
                      <span
                        className={cn(
                          "mt-0.5 block text-right text-[10px]",
                          m.mio ? "text-zinc-950/60" : "text-muted-foreground"
                        )}
                      >
                        {formatHora(m.creado_at)}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={finRef} />
            </div>

            {/* Solicitud pendiente recibida → aceptar / bloquear */}
            {hilo?.conversacion.estado === "pendiente" && !hilo.conversacion.inicie_yo && (
              <div className="flex items-center gap-2 border-t border-border bg-amber-500/5 p-3">
                <p className="flex-1 text-xs text-muted-foreground">
                  Aceptá para mover esta conversación a tu bandeja, o respondé directamente.
                </p>
                <button
                  onClick={bloquear}
                  className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                  Rechazar
                </button>
                <button
                  onClick={aceptar}
                  className="flex items-center gap-1 rounded-lg bg-amber-500 px-2.5 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-amber-400"
                >
                  <Check className="h-3.5 w-3.5" />
                  Aceptar
                </button>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="border-t border-border bg-red-500/5 px-4 py-2 text-xs text-red-400">
                {error}
              </p>
            )}

            {/* Composer */}
            <form
              onSubmit={enviar}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={
                  hilo?.conversacion.bloqueado
                    ? "Conversación bloqueada"
                    : "Escribí un mensaje…"
                }
                disabled={hilo?.conversacion.bloqueado || enviando}
                maxLength={4000}
                className="flex-1 rounded-xl border border-border bg-muted/30 px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-amber-500/40 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!draft.trim() || enviando || hilo?.conversacion.bloqueado}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-zinc-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
                aria-label="Enviar"
              >
                {enviando ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
