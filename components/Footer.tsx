import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-3">
              <span className="text-gold-400">♠</span>
              <span className="text-white">ATR</span>
              <span className="text-gold-400">Poker</span>
            </Link>
            <p className="text-sm text-zinc-500">
              La comunidad de póker online de Uruguay. Reseñas, bonos, estrategia y streaming en vivo.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
              Contenido
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/salas", label: "Salas de Póker" },
                { href: "/streaming", label: "Streaming" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-300 mb-3 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/privacidad", label: "Política de Privacidad" },
                { href: "/terminos", label: "Términos de Uso" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-600 mt-4">
              El juego puede crear dependencia. Juega responsablemente. +18.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-600">
            © {year} ATRPoker. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
