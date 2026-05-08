"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MarkCompleteButtonProps {
  slug: string;
  initialCompleted: boolean;
  onToggle?: (slug: string, completed: boolean) => void;
  className?: string;
}

export function MarkCompleteButton({
  slug,
  initialCompleted,
  onToggle,
  className,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  async function toggle() {
    const next = !completed;
    // Optimistic update
    setCompleted(next);
    onToggle?.(slug, next);

    startTransition(async () => {
      try {
        const res = await fetch("/api/progreso", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, completed: next }),
        });

        if (!res.ok) {
          // Revertir si hay error del servidor
          setCompleted(!next);
          onToggle?.(slug, !next);
          return;
        }

        const data = (await res.json()) as { ok: boolean; fallback?: boolean };

        if (data.fallback) {
          // WP endpoint no disponible — guardar en localStorage como backup
          try {
            const stored = JSON.parse(
              localStorage.getItem("atrpoker_progreso") ?? "{}"
            ) as Record<string, boolean>;
            stored[slug] = next;
            localStorage.setItem("atrpoker_progreso", JSON.stringify(stored));
          } catch {
            // localStorage no disponible (SSR guard)
          }
        }
      } catch {
        // Red caída — revertir
        setCompleted(!next);
        onToggle?.(slug, !next);
      }
    });
  }

  return (
    <Button
      variant={completed ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={isPending}
      className={cn(
        "gap-2 transition-all",
        completed
          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30 hover:text-emerald-300"
          : "hover:border-emerald-500/40 hover:text-emerald-400",
        className
      )}
    >
      {completed ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? "Completado" : "Marcar como visto"}
    </Button>
  );
}
