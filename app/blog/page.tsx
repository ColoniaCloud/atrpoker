import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Blog de Póker",
  description:
    "Artículos sobre estrategia de póker, análisis de torneos, noticias y consejos para mejorar tu juego.",
  openGraph: {
    title: "Blog de Póker | ATRPoker",
    description: "Estrategia, noticias y análisis de póker en Uruguay.",
  },
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);

  const blogCategory = await getCategoryBySlug(CATEGORY_SLUGS.BLOG);

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId: blogCategory?.id,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-foreground mb-2">Blog de Póker</h1>
        <p className="text-muted-foreground text-lg">
          Estrategia, noticias y análisis{" "}
          <span className="text-muted-foreground/60">· {total} artículos</span>
        </p>
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4 text-muted-foreground/20">♠</span>
          <p className="text-lg text-muted-foreground">No hay artículos publicados aún.</p>
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
