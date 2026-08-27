import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPosts, getCategoryBySlug, getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Streaming de Póker",
  description: "Mirá las mejores mesas de póker en vivo. Torneos y cash games en streaming, libre para todos.",
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
    <div className="py-12">
      {/* Header */}
      <div className="mb-10">
        <Badge variant="destructive" className="mb-3 gap-1.5 animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Streaming
        </Badge>
        <h1 className="text-4xl font-black text-foreground">Streaming de Póker</h1>
        <p className="mt-1 text-muted-foreground">
          {total} {total === 1 ? "stream disponible" : "streams disponibles"}
        </p>
      </div>

      {/* Grid */}
      {streams.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => {
              const imageUrl = getFeaturedImageUrl(stream, "medium_large");
              const isLive = stream.acf?.is_live;
              return (
                <Link key={stream.id} href={`/streaming/${stream.slug}`} className="group block">
                  <Card className="overflow-hidden transition-colors hover:border-muted">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-secondary">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={stripHtml(stream.title.rendered)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Play className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/80">
                          <Play className="h-6 w-6 text-white ml-0.5" fill="white" />
                        </div>
                      </div>

                      {/* Badge EN VIVO */}
                      {isLive && (
                        <Badge
                          variant="destructive"
                          className="absolute left-2 top-2 gap-1.5 animate-pulse"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          EN VIVO
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-4">
                      <h2
                        className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: stream.title.rendered }}
                      />
                      <time dateTime={stream.date} className="mt-1 block text-xs text-muted-foreground">
                        {formatDate(stream.date)}
                      </time>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/streaming" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Play className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <p className="text-lg text-muted-foreground">No hay streams disponibles aún.</p>
        </div>
      )}
    </div>
  );
}
