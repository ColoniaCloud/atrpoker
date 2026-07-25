"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

/**
 * Ícono de mensajes con badge de no-leídos para la navbar.
 * Solo se renderiza con sesión iniciada. Consulta /api/mensajes/no-leidos
 * (barato) cada 45s y al volver la pestaña a foco.
 */
export function MensajesBell() {
  const { status } = useSession();
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/mensajes/no-leidos", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { total?: number };
      setCount(typeof data.total === "number" ? data.total : 0);
    } catch {
      // silencioso: el badge no es crítico
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchCount();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") fetchCount();
    }, 45000);
    const onVis = () => {
      if (document.visibilityState === "visible") fetchCount();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [status, fetchCount]);

  if (status !== "authenticated") return null;

  return (
    <Link
      href="/perfil/mensajes"
      aria-label={count > 0 ? `Mensajes (${count} sin leer)` : "Mensajes"}
      className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
    >
      <MessageCircle className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black leading-none text-zinc-950">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
