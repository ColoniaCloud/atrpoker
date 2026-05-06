"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu, ChevronDown, LogOut, User, BookOpen, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WPCoach } from "@/lib/types";
import { stripHtml } from "@/lib/wordpress";
import { UserMenuDropdown } from "@/components/UserMenuDropdown";

// ─── Datos del menú ────────────────────────────────────────────────────────

const ACADEMIA = [
  { href: "/academia/curso-principiantes", label: "Curso Principiantes", desc: "Empezá desde cero con bases sólidas" },
  { href: "/academia/curso-teorico-practico", label: "Curso Teórico Práctico", desc: "Teoría aplicada al juego real" },
  { href: "/academia/mental-coach", label: "Mental Coach", desc: "Entrenamiento mental para el juego" },
  { href: "/academia/clases-grupales", label: "Clases con BlueGhost y Piaggesi", desc: "Clases grupales en vivo" },
  { href: "/academia/clases-grupales-straussj", label: "Clases con StraussJ", desc: "Clases grupales en vivo" },
  { href: "/academia/sesion-live", label: "Sesión Live", desc: "Sesiones en tiempo real" },
];

const SALAS = [
  { href: "/salas/ignition", label: "Ignition" },
  { href: "/salas/wpt", label: "NEXA (WPT)" },
  { href: "/salas/gg-poker", label: "GG Poker" },
  { href: "/salas/coin-poker", label: "Coin Poker" },
  { href: "/salas/poker-king", label: "Poker King" },
  { href: "/salas/champion-poker", label: "Champion Poker" },
  { href: "/salas/acr-poker", label: "ACR Poker" },
];


const TABLAS = [
  { href: "/tablas/mid-stakes", label: "PreFlop · Mid Stakes", desc: "Rangos para stakes medios" },
  { href: "/tablas/microlimites", label: "PreFlop · Microlímites", desc: "Rangos para microlímites" },
  { href: "/tablas/como-usar", label: "¿Cómo usar las tablas?", desc: "Guía de uso paso a paso" },
];

const CONTENIDOS = [
  { href: "/blog?cat=noticias", label: "Noticias", icon: "📰" },
  { href: "/blog?cat=blog-blog", label: "Lecturas", icon: "📖" },
  { href: "/streaming", label: "Videos", icon: "🎬" },
];

// ─── NavItem para dropdown desktop ────────────────────────────────────────

function NavItem({ href, label, desc }: { href: string; label: string; desc?: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group/item block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-amber-500 focus:bg-amber-500"
          )}
        >
          <div className="text-sm font-medium leading-none group-hover/item:text-zinc-950 transition-colors">{label}</div>
          {desc && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground group-hover/item:text-zinc-800 transition-colors">{desc}</p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// ─── Sección accordion para mobile ───────────────────────────────────────

function MobileSection({
  title,
  items,
  viewAllHref,
  onClose,
}: {
  title: string;
  items: { href: string; label: string; desc?: string; icon?: string }[];
  viewAllHref?: string;
  onClose: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="flex w-full items-center justify-between py-2.5 text-sm font-semibold text-foreground"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="mb-2 ml-2 space-y-1 border-l border-border pl-3">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              onClick={onClose}
              className="block py-1.5 text-xs font-medium text-primary"
            >
              Ver todos →
            </Link>
          )}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────

export function Navbar({ coaches = [] }: { coaches?: WPCoach[] }) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const coachItems = coaches.map((c) => ({
    href: `/coaches/${c.slug}`,
    label: stripHtml(c.title.rendered),
    desc: c.acf?.especialidad ?? c.acf?.disciplina ?? c.acf?.descripcion ?? undefined,
  }));

  return (
    <header className="sticky top-4 z-50 w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[65vw] mx-auto rounded-2xl border border-[hsl(199_55%_14%)] bg-background/70 backdrop-blur-md shadow-lg">
      <div className="flex h-16 items-center justify-between px-6 sm:px-8">

        {/* Logo */}
        <Link href="/" className="shrink-0 mr-4">
          <Image
            src="/brand/Isologotipo.webp"
            alt="ATRPoker"
            width={100}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>

            {/* Academia */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Academia
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[540px] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Academia de Póker
                    </p>
                    <Link href="/academia" className="text-xs text-primary hover:underline">
                      Ver todo →
                    </Link>
                  </div>
                  <ul className="grid grid-cols-2 gap-1">
                    {ACADEMIA.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Salas */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Salas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[320px] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Salas de Póker
                    </p>
                    <Link href="/salas" className="text-xs text-primary hover:underline">
                      Ver todas →
                    </Link>
                  </div>
                  <ul className="grid gap-1">
                    {SALAS.map((item) => (
                      <NavItem key={item.href} label={item.label} href={item.href} />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Coaches */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Coaches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[420px] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Coaches Privados
                    </p>
                    <Link href="/coaches" className="text-xs text-primary hover:underline">
                      Ver todos →
                    </Link>
                  </div>
                  <ul className="grid grid-cols-2 gap-1">
                    {coachItems.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Tablas */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Tablas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[360px] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tablas PreFlop
                  </p>
                  <ul className="grid gap-1">
                    {TABLAS.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* Contenidos */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Contenidos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[240px] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contenidos
                  </p>
                  <ul className="grid gap-1">
                    {CONTENIDOS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="group/icon flex items-center gap-3 rounded-md p-3 hover:bg-amber-500 transition-colors [&:hover_span]:text-zinc-950 [&:hover_span:last-child]:text-zinc-950"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium transition-colors">{item.label}</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Auth — desktop */}
        <div className="hidden lg:flex items-center gap-2 ml-4">
          {session?.user ? (
            <UserMenuDropdown name={session.user.name ?? "Usuario"} />
          ) : (
            <Button asChild size="sm">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>

        {/* Mobile — Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Abrir menú">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetTitle className="sr-only">Menú principal</SheetTitle>
            <div className="mb-6 mt-2">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Image
                  src="/brand/Isologotipo.webp"
                  alt="ATRPoker"
                  width={90}
                  height={26}
                  className="h-7 w-auto object-contain"
                />
              </Link>
            </div>

            <nav className="space-y-1">
              <MobileSection title="Academia" items={ACADEMIA} viewAllHref="/academia" onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Salas" items={SALAS} viewAllHref="/salas" onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Coaches Privados" items={coachItems} viewAllHref="/coaches" onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Tablas PreFlop" items={TABLAS} onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Contenidos" items={CONTENIDOS} onClose={() => setMobileOpen(false)} />
            </nav>

            <Separator className="my-4" />

            {session?.user ? (
              <div className="space-y-1">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Mi cuenta — {session.user.name}
                </p>
                <Link
                  href="/perfil"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <User className="h-4 w-4 shrink-0" />
                  Mi cuenta
                </Link>
                <Link
                  href="/academia"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Mi academia
                </Link>
                <a
                  href="https://wa.me/5491124932724"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Headphones className="h-4 w-4 shrink-0" />
                  Soporte
                </a>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Salir
                </button>
              </div>
            ) : (
              <Button asChild className="w-full">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Iniciar sesión
                </Link>
              </Button>
            )}
          </SheetContent>
        </Sheet>

      </div>
    </header>
  );
}
