import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts, getCategoryBySlug, getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Streaming de Póker",
  description: "Mirá las mejores mesas de póker en vivo. Torneos y cash games con streaming exclusivo para miembros.",
  robots: { index: false }, // El listado de streaming no se indexa
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function StreamingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);

  const streamingCategory = await getCategoryBySlug(CATEGORY_SLUGS.STREAMING);

  const { items: streams, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId: streamingCategory?.id,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-medium mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Streaming
          </div>
          <h1 className="text-4xl font-black text-white">Streaming de Póker</h1>
          <p className="text-zinc-400 mt-1">
            {total} {total === 1 ? "stream disponible" : "streams disponibles"}
          </p>
        </div>
      </div>

      {/* Grid de streams */}
      {streams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => {
              const imageUrl = getFeaturedImageUrl(stream, "medium_large");
              const isLive = stream.acf?.is_live;
              return (
                <Link
                  key={stream.id}
                  href={`/streaming/${stream.slug}`}
                  className="card group block"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-zinc-800">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={stripHtml(stream.title.rendered)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <svg className="w-12 h-12 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}

                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-brand-600/80 flex items-center justify-center">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Badge EN VIVO */}
                    {isLive && (
                      <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        EN VIVO
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h2
                      className="font-bold text-zinc-100 group-hover:text-brand-400 transition-colors line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: stream.title.rendered }}
                    />
                    <time dateTime={stream.date} className="text-xs text-zinc-500 mt-1 block">
                      {formatDate(stream.date)}
                    </time>
                  </div>
                </Link>
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/streaming"
          />
        </>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg">No hay streams disponibles aún.</p>
        </div>
      )}
    </div>
  );
}
