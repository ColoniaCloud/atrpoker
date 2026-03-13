import type { Metadata } from "next";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">Blog de Póker</h1>
        <p className="text-zinc-400 text-lg">
          Estrategia, noticias y análisis —{" "}
          <span className="text-zinc-500">{total} artículos</span>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/blog"
          />
        </>
      ) : (
        <div className="text-center py-20 text-zinc-500">
          <span className="text-5xl block mb-4">♠</span>
          <p className="text-lg">No hay artículos publicados aún.</p>
        </div>
      )}
    </div>
  );
}
