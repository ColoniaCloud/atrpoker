"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  User,
  ChevronDown,
  BookOpen,
  Headphones,
  LogOut,
  LogIn,
  UserPlus,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  /** Si viene `name`, se renderiza el menú de usuario autenticado. Si es `null`, el menú de invitado. */
  name: string | null;
}

const MENU_ITEMS_LOGGED = [
  { label: "Mi cuenta", href: "/perfil", icon: User },
  { label: "Mensajes", href: "/perfil/mensajes", icon: MessagesSquare },
  { label: "Mi academia", href: "/academia", icon: BookOpen },
  { label: "Soporte", href: "/perfil/asesoramiento", icon: Headphones },
] as const;

const MENU_ITEMS_GUEST = [
  { label: "Iniciar sesión", href: "/login", icon: LogIn },
  { label: "Registrate", href: "/registro", icon: UserPlus },
] as const;

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

export function UserMenuDropdown({ name }: Props) {
  const [open, setOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLogged = Boolean(name);

  function onMouseEnter() {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setOpen(true);
  }

  function onMouseLeave() {
    leaveTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={isLogged ? `Menú de ${name}` : "Acceder o registrarse"}
        className={cn(
          "flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200",
          open
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        )}
      >
        {isLogged ? (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-[11px] font-black text-zinc-950 shadow-sm">
            {getInitial(name as string)}
          </span>
        ) : (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
            <User className="h-3.5 w-3.5" />
          </span>
        )}
        {isLogged && <span className="max-w-[140px] truncate">{name}</span>}
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-52 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/20"
        >
          {/* Header */}
          <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
            {isLogged ? (
              <>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-black text-zinc-950">
                  {getInitial(name as string)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground leading-tight">
                    {name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Mi cuenta</p>
                </div>
              </>
            ) : (
              <>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4 text-foreground" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground leading-tight">
                    Bienvenido
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Accedé a tu cuenta
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Options */}
          <div className="p-1.5">
            {(isLogged ? MENU_ITEMS_LOGGED : MENU_ITEMS_GUEST).map((item) => (
              <Link
                key={item.label}
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors duration-150 hover:bg-muted hover:text-foreground"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            ))}

            {isLogged && (
              <>
                <div className="my-1.5 h-px bg-border" />
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors duration-150 hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
