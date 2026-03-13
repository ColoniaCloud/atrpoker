import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-4 text-8xl font-black text-muted-foreground/10">404</div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">Página no encontrada</h1>
        <p className="mb-8 text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">
              <BookOpen className="mr-2 h-4 w-4" />
              Ver el blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
