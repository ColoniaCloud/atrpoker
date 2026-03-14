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
import { Menu, ChevronDown, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Datos del menú ────────────────────────────────────────────────────────

const ACADEMIA = [
  { href: "/academia/curso-principiantes", label: "Curso Principiantes", desc: "Empezá desde cero con bases sólidas" },
  { href: "/academia/curso-teorico-practico", label: "Curso Teórico Práctico", desc: "Teoría aplicada al juego real" },
  { href: "/academia/mental-coach", label: "Mental Coach", desc: "Entrenamiento mental para el juego" },
  { href: "/academia/clases-grupales-blueghost", label: "Clases con BlueGhost y Piagessi", desc: "Clases grupales en vivo" },
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

const COACHES = [
  { href: "/coaches/straussj", label: "StraussJ", desc: "MTT y Cash" },
  { href: "/coaches/blueghost", label: "Blueghost", desc: "Cash" },
  { href: "/coaches/yerar", label: "Yerar", desc: "MTT" },
  { href: "/coaches/juanma", label: "Juanma", desc: "Cash WPT" },
  { href: "/coaches/josue", label: "Josué", desc: "Cash" },
  { href: "/coaches/ludmila", label: "Ludmila", desc: "Yoga · Mental Game" },
];

const TABLAS = [
  { href: "/tablas/mid-stakes", label: "PreFlop · Mid Stakes", desc: "Rangos para stakes medios" },
  { href: "/tablas/microlimites", label: "PreFlop · Microlímites", desc: "Rangos para microlímites" },
  { href: "/tablas/como-usar", label: "¿Cómo usar las tablas?", desc: "Guía de uso paso a paso" },
];

const CONTENIDOS = [
  { href: "/noticias", label: "Noticias", icon: "📰" },
  { href: "/blog", label: "Lecturas", icon: "📖" },
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
            "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          )}
        >
          <div className="text-sm font-medium leading-none">{label}</div>
          {desc && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground">{desc}</p>
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

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 w-[85vw] mx-auto rounded-2xl border border-border bg-background/90 backdrop-blur-md shadow-lg">
      <div className="flex h-14 items-center justify-between px-5 sm:px-6">

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
                    {COACHES.map((item) => (
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
                            className="flex items-center gap-3 rounded-md p-3 hover:bg-accent transition-colors"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
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
            <>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {session.user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Salir
              </Button>
            </>
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
              <MobileSection title="Coaches Privados" items={COACHES} viewAllHref="/coaches" onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Tablas PreFlop" items={TABLAS} onClose={() => setMobileOpen(false)} />
              <Separator />
              <MobileSection title="Contenidos" items={CONTENIDOS} onClose={() => setMobileOpen(false)} />
            </nav>

            <Separator className="my-4" />

            {session?.user ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Conectado como <strong className="text-foreground">{session.user.name}</strong>
                </p>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: "/" }); }}
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </Button>
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
