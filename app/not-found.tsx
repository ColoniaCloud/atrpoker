import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl font-black text-zinc-800 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-3">Página no encontrada</h1>
        <p className="text-zinc-400 mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Ir al inicio
          </Link>
          <Link href="/blog" className="btn-outline">
            Ver el blog
          </Link>
        </div>
      </div>
    </div>
  );
}
