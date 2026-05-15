"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  SendHorizonal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from "lucide-react";
import { WhatsAppChatModal } from "@/components/WhatsAppChatModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TIPOS = [
  { value: "sala",     label: "Elección de sala" },
  { value: "deposito", label: "Depósito" },
  { value: "retiro",   label: "Retiro" },
  { value: "rakeback", label: "Rakeback" },
  { value: "otro",     label: "Otro" },
] as const;

type Estado = "idle" | "loading" | "success" | "error";

export default function AsesoramientoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tipo,    setTipo]    = useState("sala");
  const [asunto,  setAsunto]  = useState("");
  const [mensaje, setMensaje] = useState("");
  const [estado,  setEstado]  = useState<Estado>("idle");
  const [waOpen,  setWaOpen]  = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/perfil/asesoramiento");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!asunto.trim() || !mensaje.trim()) return;

    setEstado("loading");
    try {
      const res = await fetch("/api/soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo, asunto: asunto.trim(), mensaje: mensaje.trim() }),
      });

      if (!res.ok) throw new Error();
      setEstado("success");
      setAsunto("");
      setMensaje("");
      setTipo("sala");
    } catch {
      setEstado("error");
    }
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-32 pb-16 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-background" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[380px] w-[700px] rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-4">
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground/70">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <Link href="/perfil" className="hover:text-foreground transition-colors">Mi cuenta</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground/60">Asesoramiento</span>
          </nav>

          <Badge
            variant="outline"
            className="mb-5 border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
          >
            Gratuito
          </Badge>
          <h1 className="mb-3 text-4xl font-black leading-tight text-foreground md:text-5xl">
            ¿En qué te{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              ayudamos?
            </span>
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Completá el formulario y nuestro equipo se pondrá en contacto con vos a la brevedad.
          </p>
        </div>
      </section>

      {/* ── Form ─────────────────────────────────────────────── */}
      <div className="py-12">
        <div className="mx-auto max-w-2xl">

          {/* Success state */}
          {estado === "success" && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
              <div>
                <p className="font-semibold text-green-400">¡Ticket enviado!</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Recibimos tu consulta. Te respondemos en breve al email de tu cuenta.
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {estado === "error" && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
              <div>
                <p className="font-semibold text-red-400">No se pudo enviar</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Ocurrió un error. Por favor intentá de nuevo o contactanos por WhatsApp.
                </p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-8 space-y-6"
          >
            {/* Remitente (solo lectura) */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-zinc-950">
                {(session.user.name ?? "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">
                  {session.user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">
                Tipo de consulta
              </label>
              <div className="flex flex-wrap gap-2">
                {TIPOS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTipo(t.value)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150",
                      tipo === t.value
                        ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Asunto */}
            <div className="space-y-2">
              <label htmlFor="asunto" className="text-sm font-semibold text-foreground">
                Asunto
              </label>
              <Input
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Ej: Quiero saber cuál sala me conviene"
                required
                maxLength={120}
                className="bg-background"
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <label htmlFor="mensaje" className="text-sm font-semibold text-foreground">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Contanos tu situación, en qué sala jugás actualmente, tu volumen de juego, dudas sobre depósitos o retiros, etc."
                required
                rows={6}
                maxLength={2000}
                className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500/60 transition-colors"
              />
              <p className="text-right text-xs text-muted-foreground">
                {mensaje.length}/2000
              </p>
            </div>

            <Button
              type="submit"
              disabled={estado === "loading" || !asunto.trim() || !mensaje.trim()}
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold gap-2"
              size="lg"
            >
              {estado === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4" />
                  Enviar consulta
                </>
              )}
            </Button>
          </form>

          {/* WhatsApp direct option */}
          <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Preferís hablar directo con nuestro equipo?
            </p>
            <button
              onClick={() => setWaOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#1ebe5d]"
            >
              <MessageCircle className="h-4 w-4" />
              Abrir chat de WhatsApp
            </button>
          </div>
        </div>
      </div>

      <WhatsAppChatModal open={waOpen} onClose={() => setWaOpen(false)} />
    </>
  );
}
