import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info, Club } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getSalas } from "@/lib/wordpress";
import { SalaCard } from "@/components/SalaCard";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Salas de Póker Online",
  description:
    "Reseñas completas de las mejores salas de póker online: bonos, códigos de descuento, software, variantes y más.",
  openGraph: {
    title: "Salas de Póker Online | ATRPoker",
    description: "Reseñas de las mejores salas de póker online con bonos exclusivos.",
  },
};

export const revalidate = 3600;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function SalasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);

  const { items: salas, totalPages, total } = await getSalas({
    page: currentPage,
    perPage: 12,
  });

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground mb-2">Salas de Póker Online</h1>
        <p className="text-muted-foreground text-lg">
          Reseñas honestas y bonos exclusivos{" "}
          <span className="text-muted-foreground/60">· {total} salas analizadas</span>
        </p>
      </div>

      {/* Disclaimer */}
      <Alert className="mb-8 border-border bg-card">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-muted-foreground">
          <strong className="text-foreground">Nota sobre afiliados:</strong>{" "}
          Algunos links son links de referido. Las reseñas son independientes y reflejan nuestra opinión honesta.
        </AlertDescription>
      </Alert>

      {/* Grid */}
      {salas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salas.map((sala, i) => (
              <SalaCard key={sala.id} sala={sala} index={i} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/salas" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Club className="mb-4 h-16 w-16 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">No hay salas publicadas aún.</p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
