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
import {
  Menu, ChevronDown, LogOut, User, BookOpen, Headphones,
  Newspaper, Film, ArrowRight,
  GraduationCap, Ruler, Brain, Target, Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { WPCoach, WPSala } from "@/lib/types";
import { stripHtml } from "@/lib/wordpress";
import { UserMenuDropdown } from "@/components/UserMenuDropdown";

// ─── Datos estáticos del menú ──────────────────────────────────────────────────

const ACADEMIA_ITEMS = [
  { href: "/academia/curso-principiantes",     slug: "curso-principiantes",      label: "Curso Principiantes",             desc: "Empezá desde cero con bases sólidas" },
  { href: "/academia/curso-teorico-practico",  slug: "curso-teorico-practico",   label: "Curso Teórico Práctico",          desc: "Teoría aplicada al juego real" },
  { href: "/academia/mental-coach",            slug: "mental-coach",             label: "Mental Coach",                    desc: "Entrenamiento mental para el juego" },
  { href: "/academia/clases-grupales",         slug: "clases-grupales",          label: "Clases con BlueGhost y Piaggesi", desc: "Clases grupales en vivo" },
  { href: "/academia/clases-grupales-straussj",slug: "clases-grupales-straussj", label: "Clases con StraussJ",             desc: "Clases grupales en vivo" },
  { href: "/academia/sesion-live",             slug: "sesion-live",              label: "Sesión Live",                     desc: "Sesiones en tiempo real" },
];

const ACADEMIA_ICON: Record<string, { icon: LucideIcon; iconClass: string }> = {
  "curso-principiantes":      { icon: GraduationCap, iconClass: "text-emerald-400" },
  "curso-teorico-practico":   { icon: Ruler,         iconClass: "text-sky-400"     },
  "mental-coach":             { icon: Brain,         iconClass: "text-violet-400"  },
  "clases-grupales":          { icon: Target,        iconClass: "text-amber-400"   },
  "clases-grupales-straussj": { icon: Trophy,        iconClass: "text-orange-400"  },
  "sesion-live":              { icon: Film,          iconClass: "text-rose-400"    },
};

const SALAS_SLUGS = [
  { href: "/salas/ignition",       slug: "ignition",       label: "Ignition"        },
  { href: "/salas/wpt",            slug: "wpt",            label: "NEXA (WPT)"      },
  { href: "/salas/gg-poker",       slug: "gg-poker",       label: "GG Poker"        },
  { href: "/salas/coin-poker",     slug: "coin-poker",     label: "Coin Poker"      },
  { href: "/salas/poker-king",     slug: "poker-king",     label: "Poker King"      },
  { href: "/salas/champion-poker", slug: "champion-poker", label: "Champion Poker"  },
  { href: "/salas/acr-poker",      slug: "acr-poker",      label: "ACR Poker"       },
];

const TABLAS = [
  { href: "/tablas/mid-stakes",   label: "PreFlop · Mid Stakes",    desc: "Rangos para stakes medios" },
  { href: "/tablas/microlimites", label: "PreFlop · Microlímites",  desc: "Rangos para microlímites"  },
  { href: "/tablas/como-usar",    label: "¿Cómo usar las tablas?",  desc: "Guía de uso paso a paso"   },
];

const CONTENIDOS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/blog?cat=noticias",  label: "Noticias", icon: Newspaper },
  { href: "/blog?cat=blog-blog", label: "Lecturas", icon: BookOpen  },
  { href: "/streaming",          label: "Videos",   icon: Film      },
];

// ─── Componentes de items ──────────────────────────────────────────────────────

// Enlace destacado "Ver todos" en la parte superior de cada dropdown
function FeaturedLink({ href, label, desc }: { href: string; label: string; desc?: string }) {
  return (
    <NavigationMenuLink asChild>
      <Link
        href={href}
        className="group/feat mb-3 flex items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.08] px-4 py-3 transition-colors hover:border-amber-500/60 hover:bg-amber-500/[0.18]"
      >
        <div>
          <p className="text-sm font-bold text-foreground">{label}</p>
          {desc && <p className="text-xs text-muted-foreground">{desc}</p>}
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 text-amber-400 transition-transform group-hover/feat:translate-x-0.5" />
      </Link>
    </NavigationMenuLink>
  );
}

// Item de mega menu: slot de icono (LucideIcon o imagen URL) + label + desc
interface MegaItemProps {
  href: string;
  label: string;
  desc?: string;
  icon?: LucideIcon;
  iconClass?: string;
  imgUrl?: string | null;
  imgAlt?: string;
  fallbackInitial?: string;
}

function MegaItem({ href, label, desc, icon: Icon, iconClass, imgUrl, imgAlt, fallbackInitial }: MegaItemProps) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="group/item flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-amber-500"
        >
          {/* Slot de icono */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 transition-colors group-hover/item:bg-amber-400/20 overflow-hidden">
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={imgAlt ?? label}
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
            ) : Icon ? (
              <Icon className={cn("h-5 w-5", iconClass ?? "text-muted-foreground")} />
            ) : fallbackInitial ? (
              <span className="text-xs font-black text-amber-400">{fallbackInitial}</span>
            ) : null}
          </div>

          {/* Texto */}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold leading-tight text-foreground transition-colors group-hover/item:text-zinc-950">
              {label}
            </div>
            {desc && (
              <p className="mt-0.5 line-clamp-1 text-xs leading-tight text-muted-foreground transition-colors group-hover/item:text-zinc-700">
                {desc}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// Item simple para Tablas y Contenidos (sin imagen)
function NavItem({ href, label, desc }: { href: string; label: string; desc?: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="group/item block select-none rounded-xl p-3 transition-colors hover:bg-amber-500"
        >
          <div className="text-sm font-medium leading-none text-foreground transition-colors group-hover/item:text-zinc-950">
            {label}
          </div>
          {desc && (
            <p className="mt-1 line-clamp-2 text-xs leading-snug text-muted-foreground transition-colors group-hover/item:text-zinc-700">
              {desc}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

// ─── Sección accordion para mobile ────────────────────────────────────────────

type MobileItem = {
  href: string;
  label: string;
  desc?: string;
  icon?: LucideIcon;
  imgUrl?: string | null;
};

function MobileSection({
  title,
  items,
  viewAllHref,
  viewAllLabel,
  onClose,
}: {
  title: string;
  items: MobileItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
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
        <div className="mb-2 ml-2 space-y-0.5 border-l border-border pl-3">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              onClick={onClose}
              className="flex items-center gap-1.5 py-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <ArrowRight className="h-3 w-3" />
              {viewAllLabel ?? "Ver todos"}
            </Link>
          )}
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2.5 rounded-lg py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.imgUrl ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded">
                  <Image src={item.imgUrl} alt={item.label} width={20} height={20} className="h-5 w-5 object-contain" />
                </div>
              ) : item.icon ? (
                <item.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : null}
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────

export function Navbar({ coaches = [], salas = [] }: { coaches?: WPCoach[]; salas?: WPSala[] }) {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Mapa slug → sala para obtener el favicon rápido
  const salaMap = new Map(salas.map((s) => [s.slug, s]));

  // Items de coaches con imagen destacada
  const coachItems = coaches.map((c) => ({
    href: `/coaches/${c.slug}`,
    label: stripHtml(c.title.rendered),
    desc: c.acf?.especialidad ?? c.acf?.disciplina ?? undefined,
    imgUrl: c._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
  }));

  // Items de salas con favicon
  const salaItems = SALAS_SLUGS.map((s) => {
    const sala = salaMap.get(s.slug);
    const icono = sala?.acf?.icono_de_la_sala;
    const iconoUrl = typeof icono === "object" && icono ? icono.url : null;
    return { ...s, imgUrl: iconoUrl };
  });

  // Items de academia con iconos para mobile
  const academiaItems: MobileItem[] = ACADEMIA_ITEMS.map((a) => ({
    href: a.href,
    label: a.label,
    icon: ACADEMIA_ICON[a.slug]?.icon,
  }));

  return (
    <header className="sticky top-4 z-50 w-[90vw] md:w-[85vw] lg:w-[75vw] xl:w-[70vw] 2xl:w-[65vw] mx-auto rounded-2xl border border-[hsl(199_55%_14%)] bg-background/70 backdrop-blur-md shadow-lg">

      {/* Desktop navigation — overlay absoluto sobre todo el header para que el
          viewport tenga referencia al ancho completo y no recorte los mega-menus */}
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-16 items-center justify-center lg:flex">
        <NavigationMenu className="pointer-events-auto">
          <NavigationMenuList>

            {/* ── Academia ───────────────────────────────────────────────── */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Academia
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[580px] p-4">
                  <FeaturedLink
                    href="/academia"
                    label="Ver toda la Academia"
                    desc="Cursos, clases grupales, coaching mental y sesiones en vivo"
                  />
                  <ul className="grid grid-cols-2 gap-0.5">
                    {ACADEMIA_ITEMS.map((item) => {
                      const meta = ACADEMIA_ICON[item.slug];
                      return (
                        <MegaItem
                          key={item.href}
                          href={item.href}
                          label={item.label}
                          desc={item.desc}
                          icon={meta?.icon}
                          iconClass={meta?.iconClass}
                        />
                      );
                    })}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ── Salas ──────────────────────────────────────────────────── */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Salas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[420px] p-4">
                  <FeaturedLink
                    href="/salas"
                    label="Ver todas las salas"
                    desc="Reseñas, bonos exclusivos y rakeback"
                  />
                  <ul className="grid grid-cols-2 gap-0.5">
                    {salaItems.map((item) => (
                      <MegaItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        imgUrl={item.imgUrl}
                        fallbackInitial={item.label.charAt(0)}
                      />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ── Coaches ────────────────────────────────────────────────── */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Coaches
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[520px] p-4">
                  <FeaturedLink
                    href="/coaches"
                    label="Ver todos los coaches"
                    desc="Coaching privado y grupal con los mejores jugadores"
                  />
                  <ul className="grid grid-cols-2 gap-0.5">
                    {coachItems.map((item) => (
                      <MegaItem
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        desc={item.desc}
                        imgUrl={item.imgUrl}
                        fallbackInitial={item.label.charAt(0)}
                      />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ── Tablas ─────────────────────────────────────────────────── */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Tablas
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[360px] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tablas PreFlop
                  </p>
                  <ul className="grid gap-0.5">
                    {TABLAS.map((item) => (
                      <NavItem key={item.href} {...item} />
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* ── Contenidos ─────────────────────────────────────────────── */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-transparent text-sm font-medium">
                Contenidos
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[240px] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contenidos
                  </p>
                  <ul className="grid gap-0.5">
                    {CONTENIDOS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="group/icon flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-amber-500"
                          >
                            <item.icon className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover/icon:text-zinc-950" />
                            <span className="text-sm font-medium text-foreground transition-colors group-hover/icon:text-zinc-950">
                              {item.label}
                            </span>
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
      </div>{/* /overlay absoluto desktop */}

      {/* Header bar: Logo + Auth desktop + Mobile trigger */}
      <div className="flex h-16 items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" className="relative z-10 mr-4 shrink-0">
          <Image
            src="/brand/Isologotipo.webp"
            alt="ATRPoker"
            width={100}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
        </Link>

        {/* Spacer — empuja Auth a la derecha sin que el NavigationMenu ocupe espacio en el flujo */}
        <div className="flex-1" />

        {/* Auth — desktop */}
        <div className="relative z-10 hidden lg:flex items-center gap-2">
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
              <MobileSection
                title="Academia"
                items={academiaItems}
                viewAllHref="/academia"
                viewAllLabel="Ver toda la Academia"
                onClose={() => setMobileOpen(false)}
              />
              <Separator />
              <MobileSection
                title="Salas"
                items={salaItems}
                viewAllHref="/salas"
                viewAllLabel="Ver todas las salas"
                onClose={() => setMobileOpen(false)}
              />
              <Separator />
              <MobileSection
                title="Coaches Privados"
                items={coachItems}
                viewAllHref="/coaches"
                viewAllLabel="Ver todos los coaches"
                onClose={() => setMobileOpen(false)}
              />
              <Separator />
              <MobileSection
                title="Tablas PreFlop"
                items={TABLAS}
                onClose={() => setMobileOpen(false)}
              />
              <Separator />
              <MobileSection
                title="Contenidos"
                items={CONTENIDOS}
                onClose={() => setMobileOpen(false)}
              />
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
