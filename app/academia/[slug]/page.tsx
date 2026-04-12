import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { ESCUELA_SUBCATEGORIES } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { Pagination } from "@/components/Pagination";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateStaticParams() {
  return ESCUELA_SUBCATEGORIES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const subcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === slug);
  if (!subcat) return { title: "Categoría no encontrada" };
  return {
    title: `${subcat.label} | Academia ATRPoker`,
    description: `Contenidos de ${subcat.label} en la Academia de Póker de ATRPoker.`,
  };
}

export default async function AcademiaSubcatPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page ?? 1);

  const subcat = ESCUELA_SUBCATEGORIES.find((s) => s.slug === slug);
  if (!subcat) notFound();

  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId: cat.id,
  });

  return (
    <div className="py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/academia" className="hover:text-foreground transition-colors">Academia</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground/70">{subcat.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-foreground mb-2">{subcat.label}</h1>
        <p className="text-muted-foreground text-lg">
          {total} publicación{total !== 1 ? "es" : ""}
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
            basePath={`/academia/${slug}`}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="text-6xl mb-4 text-muted-foreground/20">♠</span>
          <p className="text-lg text-muted-foreground">No hay contenidos publicados aún.</p>
          <Link href="/academia" className="mt-6 text-sm text-primary hover:underline">
            ← Volver a Academia
          </Link>
        </div>
      )}
    </div>
  );
}
