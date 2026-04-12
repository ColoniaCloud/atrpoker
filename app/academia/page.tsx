import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { ESCUELA_SUBCATEGORIES } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Academia de Póker",
  description:
    "Cursos, clases grupales, coaching mental y sesiones en vivo para mejorar tu nivel de juego.",
  openGraph: {
    title: "Academia de Póker | ATRPoker",
    description: "Formación y desarrollo para jugadores de póker de todos los niveles.",
  },
};

export const revalidate = 300;

interface PageProps {
  searchParams: Promise<{ page?: string; cat?: string }>;
}

export default async function AcademiaPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const activeCat = params.cat ?? null;

  // Resolve category ID(s) to filter posts
  let categoryId: number | undefined;
  let categoryIds: number[] | undefined;

  if (activeCat) {
    const cat = await getCategoryBySlug(activeCat);
    if (cat) categoryId = cat.id;
  } else {
    // Show all escuela subcategory posts
    const cats = await Promise.all(
      ESCUELA_SUBCATEGORIES.map((s) => getCategoryBySlug(s.slug))
    );
    const ids = cats.map((c) => c?.id).filter((id): id is number => !!id);
    if (ids.length > 0) categoryIds = ids;
  }

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId,
    categoryIds,
  });

  const activeSubcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === activeCat);
  const basePath = activeCat ? `/academia?cat=${activeCat}` : "/academia";

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground mb-2">Academia de Póker</h1>
        <p className="text-muted-foreground text-lg">
          {activeSubcat?.label ?? "Todos los contenidos"}{" "}
          <span className="text-muted-foreground/60">· {total} publicaciones</span>
        </p>
      </div>

      {/* Tabs de subcategorías */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
        <Link
          href="/academia"
          className={cn(
            "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
            !activeCat
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Todos
        </Link>
        {ESCUELA_SUBCATEGORIES.map((sub) => (
          <Link
            key={sub.slug}
            href={`/academia?cat=${sub.slug}`}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeCat === sub.slug
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {sub.label}
          </Link>
        ))}
      </div>

      {/* Grid */}
      {posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4 text-muted-foreground/20">♠</span>
          <p className="text-lg text-muted-foreground">
            No hay contenidos publicados{activeSubcat ? ` en ${activeSubcat.label}` : ""} aún.
          </p>
        </div>
      )}
    </div>
  );
}
