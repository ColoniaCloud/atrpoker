import type { Metadata } from "next";
import Link from "next/link";
import { Spade } from "lucide-react";
import { getPosts, getCategorySubtree } from "@/lib/wordpress";
import { CATEGORY_SLUGS, type WPPost } from "@/lib/types";
import { BlogBentoGrid } from "@/components/BlogBentoGrid";
import { Pagination } from "@/components/Pagination";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Blog de Póker",
  description:
    "Artículos sobre estrategia de póker, análisis de torneos, noticias y consejos para mejorar tu juego.",
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  openGraph: {
    title: "Blog de Póker | ATRPoker",
    description: "Estrategia, noticias y análisis de póker en Latinoamerica.",
    type: "website",
    url: "https://atrpoker.com/blog",
    images: [{
      url: "https://atrpoker.com/brand/Isologotipo.webp",
      width: 1200,
      height: 630,
      alt: "Blog de Póker ATRPoker",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog de Póker | ATRPoker",
    description: "Estrategia, noticias y análisis de póker en Latinoamerica.",
    images: ["https://atrpoker.com/brand/Isologotipo.webp"],
  },
};

export const revalidate = 300;

const PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string; cat?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const requestedCat = params.cat ?? null;

  // Categoría "Blog" + todas sus subcategorías (recursivo).
  // La entrada se muestra si pertenece a cualquiera de ellas, aunque no tenga
  // marcada la categoría padre "Blog".
  const blog = await getCategorySubtree(CATEGORY_SLUGS.BLOG);
  const blogIds = blog?.ids ?? [];

  // Tab activa: sólo se acepta si está dentro del árbol de Blog
  let activeCat: string | null = null;
  let categoryIds = blogIds;

  if (requestedCat) {
    const catSubtree = await getCategorySubtree(requestedCat);
    if (catSubtree && blogIds.includes(catSubtree.root.id)) {
      activeCat = requestedCat;
      categoryIds = catSubtree.ids;
    }
  }

  const tabs = [
    { slug: null, label: "Todos" },
    ...(blog?.children ?? [])
      .filter((child) => child.count > 0)
      .map((child) => ({ slug: child.category.slug, label: child.category.name })),
  ];

  // Si no se pudo resolver el árbol de Blog, mejor no mostrar nada que mostrar
  // entradas de otras secciones (academia, streaming…)
  const { items: posts, totalPages, total } =
    categoryIds.length > 0
      ? await getPosts({ page: currentPage, perPage: PER_PAGE, categoryIds })
      : { items: [] as WPPost[], totalPages: 0, total: 0 };

  const activeTab = tabs.find((t) => t.slug === activeCat) ?? tabs[0];
  const basePath = activeCat ? `/blog?cat=${activeCat}` : "/blog";

  return (
    <div className="py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-foreground mb-2">Blog de Póker</h1>
        <p className="text-muted-foreground text-lg">
          Estrategia, noticias y análisis{" "}
          <span className="text-muted-foreground/60">· {total} artículos</span>
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => {
          const href = tab.slug ? `/blog?cat=${tab.slug}` : "/blog";
          const isActive = tab.slug === activeCat;
          return (
            <Link
              key={tab.label}
              href={href}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Bento grid */}
      {posts.length > 0 ? (
        <>
          <BlogBentoGrid posts={posts} />
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Spade className="mb-4 h-16 w-16 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">
            No hay artículos en {activeTab.label} aún.
          </p>
        </div>
      )}
    </div>
  );
}
