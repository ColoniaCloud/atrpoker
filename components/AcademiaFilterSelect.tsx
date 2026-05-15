"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Check, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

type Subcategory = { slug: string; label: string };

interface Props {
  subcategories: readonly Subcategory[];
  activeCat: string | null;
}

export function AcademiaFilterSelect({ subcategories, activeCat }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeLabel =
    subcategories.find((s) => s.slug === activeCat)?.label ?? "Todas las áreas";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function select(slug: string | null) {
    setOpen(false);
    router.push(slug ? `/academia?cat=${slug}` : "/academia");
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "group flex min-w-[200px] items-center gap-2.5 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200",
          open
            ? "border-amber-500/50 ring-2 ring-amber-500/20 text-foreground"
            : "border-border text-foreground hover:border-foreground/25 hover:shadow-md"
        )}
      >
        <LayoutGrid className="h-4 w-4 shrink-0 text-amber-400" />
        <span className="flex-1 text-left">{activeLabel}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20"
        >
          {/* Header */}
          <div className="border-b border-border px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Filtrar por área
            </p>
          </div>

          <div className="p-2">
            {/* All areas option */}
            <button
              role="option"
              aria-selected={!activeCat}
              onClick={() => select(null)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                !activeCat
                  ? "bg-amber-500/10 text-amber-400 font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                  !activeCat
                    ? "border-amber-500 bg-amber-500 text-zinc-950"
                    : "border-border bg-transparent"
                )}
              >
                {!activeCat && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              Todas las áreas
            </button>

            <div className="my-1.5 h-px bg-border" />

            {/* Subcategory options */}
            {subcategories.map((sub) => {
              const isActive = activeCat === sub.slug;
              return (
                <button
                  key={sub.slug}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => select(sub.slug)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 font-semibold"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150",
                      isActive
                        ? "border-amber-500 bg-amber-500 text-zinc-950"
                        : "border-border bg-transparent"
                    )}
                  >
                    {isActive && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
