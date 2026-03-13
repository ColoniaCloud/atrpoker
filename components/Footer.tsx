import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Aprender: [
    { href: "/academia", label: "Academia" },
    { href: "/coaches", label: "Coaches Privados" },
    { href: "/tablas/mid-stakes", label: "Tablas PreFlop" },
  ],
  Contenidos: [
    { href: "/noticias", label: "Noticias" },
    { href: "/blog", label: "Lecturas" },
    { href: "/streaming", label: "Videos" },
  ],
  Salas: [
    { href: "/salas", label: "Ver todas" },
    { href: "/salas/ignition", label: "Ignition" },
    { href: "/salas/gg-poker", label: "GG Poker" },
    { href: "/salas/wpt", label: "NEXA (WPT)" },
  ],
  Legal: [
    { href: "/privacidad", label: "Política de Privacidad" },
    { href: "/terminos", label: "Términos de Uso" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 font-black text-xl mb-3">
              <span className="text-gold-400">♠</span>
              <span>ATR</span>
              <span className="text-gold-400">Poker</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              La comunidad de póker online de Uruguay. Academia, reseñas y streaming.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-3">
              +18 · Jugá responsablemente.
            </p>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-xs font-semibold text-foreground/70 mb-3 uppercase tracking-wider">
                {section}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {year} ATRPoker. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
