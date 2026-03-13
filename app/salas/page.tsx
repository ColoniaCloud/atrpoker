import type { Metadata } from "next";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          Salas de Póker Online
        </h1>
        <p className="text-zinc-400 text-lg">
          Reseñas honestas y bonos exclusivos —{" "}
          <span className="text-zinc-500">{total} salas analizadas</span>
        </p>
      </div>

      {/* Disclaimer de afiliados */}
      <div className="mb-8 p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-500">
        <strong className="text-zinc-400">Nota:</strong> Algunos links son links de referido. Las reseñas son independientes y reflejan nuestra opinión honesta.
      </div>

      {/* Grid */}
      {salas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {salas.map((sala) => (
              <SalaCard key={sala.id} sala={sala} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/salas"
          />
        </>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <span className="text-5xl block mb-4">♣</span>
          <p className="text-lg">No hay salas publicadas aún.</p>
        </div>
      )}
    </div>
  );
}
