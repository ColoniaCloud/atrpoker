"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  LogOut,
  Check,
  Lock,
  BookOpen,
  Play,
  ArrowRight,
  Shield,
  User as UserIcon,
  Mail,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Role display metadata ────────────────────────────────────────────────────

const ROLE_META: Record<string, { label: string; className: string }> = {
  administrator: {
    label: "Administrador",
    className: "border-red-500/40 bg-red-500/10 text-red-400",
  },
  editor: {
    label: "Editor",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  },
  colaborador: {
    label: "Colaborador",
    className: "border-violet-500/40 bg-violet-500/10 text-violet-400",
  },
  player: {
    label: "Player",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  subscriber: {
    label: "Suscriptor",
    className: "border-border bg-muted/50 text-muted-foreground",
  },
};

// Mirrors the logic in middleware.ts / lib/auth.ts (client-side display only)
const ACADEMIA_PREMIUM_ROLES = ["administrator", "editor", "colaborador", "player"];
const STREAMING_DEFAULT_ROLES = ["subscriber", "administrator"];

function hasPremiumAccess(roles: string[]): boolean {
  return roles.some((r) => ACADEMIA_PREMIUM_ROLES.includes(r.toLowerCase()));
}

function hasStreamingAccess(roles: string[]): boolean {
  return roles.some((r) => STREAMING_DEFAULT_ROLES.includes(r.toLowerCase()));
}

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/perfil");
    }
  }, [status, router]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  const { user } = session;
  const roles = user.roles ?? [];
  const initials = getInitials(user.name);
  const premiumAccess = hasPremiumAccess(roles);
  const streamingAccess = hasStreamingAccess(roles);

  const ACCESS_ITEMS = [
    {
      label: "Academia básica",
      desc: "Curso para principiantes · acceso libre",
      href: "/academia/curso-principiantes",
      unlocked: true,
      icon: GraduationCap,
    },
    {
      label: "Academia premium",
      desc: "Cursos, sesiones live y clases grupales",
      href: "/academia",
      unlocked: premiumAccess,
      icon: BookOpen,
    },
    {
      label: "Streaming",
      desc: "Videos en vivo y grabados",
      href: "/streaming",
      unlocked: streamingAccess,
      icon: Play,
    },
  ];

  return (
    <>
      {/* ── Hero full-bleed ──────────────────────────────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-32 pb-16 border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/90 via-zinc-900/50 to-background" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[380px] w-[700px] rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-3xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground/70">
            <Link href="/" className="hover:text-foreground transition-colors">
              Inicio
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="text-foreground/60">Mi perfil</span>
          </nav>

          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-end sm:text-left sm:gap-7">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-700 ring-2 ring-amber-500/30 ring-offset-4 ring-offset-background shadow-xl shadow-amber-900/20">
                <span className="text-3xl font-black text-zinc-950 leading-none">
                  {initials}
                </span>
              </div>
              {/* Online dot */}
              <span className="absolute bottom-0.5 right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 ring-2 ring-background">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
            </div>

            {/* Name + email + roles */}
            <div className="flex flex-col gap-2.5">
              <Badge
                variant="outline"
                className="self-center sm:self-start border-amber-500/40 text-amber-400 px-3 py-1 text-xs uppercase tracking-widest"
              >
                Perfil de usuario
              </Badge>
              <h1 className="text-4xl font-black leading-tight text-foreground md:text-5xl">
                {user.name}
              </h1>
              {user.email && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              )}
              {/* Role badges */}
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                {roles.map((role) => {
                  const meta = ROLE_META[role.toLowerCase()];
                  if (!meta) return null;
                  return (
                    <span
                      key={role}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                        meta.className
                      )}
                    >
                      {meta.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="py-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Tu acceso */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-5 flex items-center gap-2 text-base font-bold text-foreground">
            <Shield className="h-4 w-4 text-amber-400" />
            Tu acceso
          </h2>

          <div className="space-y-3">
            {ACCESS_ITEMS.map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-4 transition-colors duration-200",
                  item.unlocked
                    ? "border-border bg-muted/20 hover:border-foreground/20"
                    : "border-border/50 bg-muted/5 opacity-50"
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    item.unlocked
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                    {item.desc}
                  </p>
                </div>

                {/* CTA or Lock */}
                {item.unlocked ? (
                  <Link
                    href={item.href}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:border-amber-500/40 hover:text-amber-400 transition-colors duration-200"
                  >
                    Acceder
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground/60">
                    <Lock className="h-4 w-4" />
                    Sin acceso
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sesión */}
        <div className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <UserIcon className="h-4 w-4 text-amber-400" />
            Sesión activa
          </h2>

          <div className="flex-1 space-y-4 text-sm">
            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Usuario
              </p>
              <p className="font-medium text-foreground">{user.name}</p>
            </div>

            {user.email && (
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </p>
                <p className="font-medium text-foreground truncate">{user.email}</p>
              </div>
            )}

            <div>
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Roles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {roles.length > 0 ? (
                  roles.map((role) => {
                    const meta = ROLE_META[role.toLowerCase()];
                    return (
                      <span
                        key={role}
                        className={cn(
                          "rounded-md border px-2 py-0.5 text-[11px] font-medium",
                          meta
                            ? meta.className
                            : "border-border bg-muted/40 text-muted-foreground"
                        )}
                      >
                        {meta?.label ?? role}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </div>
            </div>
          </div>

          {/* Sign out */}
          <Button
            variant="outline"
            className="mt-auto w-full gap-2 border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>

      </div>
    </>
  );
}
