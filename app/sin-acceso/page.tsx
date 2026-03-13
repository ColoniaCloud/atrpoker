import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Acceso Restringido",
  robots: { index: false },
};

export default function SinAccesoPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-3xl font-bold text-white mb-3">Contenido restringido</h1>
        <p className="text-zinc-400 mb-8">
          No tenés acceso a esta sección. El streaming está disponible para miembros con suscripción activa.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary">
            Iniciar sesión
          </Link>
          <Link href="/" className="btn-outline">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
