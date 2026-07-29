import type { Metadata } from "next";
import Link from "next/link";
import { Spade } from "lucide-react";
import { getPosts, getCategoryBySlug } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
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

const TABS = [
  { slug: null, label: "Todos" },
  { slug: CATEGORY_SLUGS.BLOG_POSTS, label: "Blog de Póker" },
  { slug: CATEGORY_SLUGS.NOTICIAS, label: "Noticias" },
] as const;

interface PageProps {
  searchParams: Promise<{ page?: string; cat?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page ?? 1);
  const activeCat = params.cat ?? null;

  // Resolve category ID for selected tab (or fetch all blog posts if none)
  let categoryId: number | undefined;
  let categoryIds: number[] | undefined;

  if (activeCat) {
    const cat = await getCategoryBySlug(activeCat);
    if (cat) categoryId = cat.id;
  } else {
    // Fetch both subcategory IDs to show all blog content
    const [catBlog, catNoticias] = await Promise.all([
      getCategoryBySlug(CATEGORY_SLUGS.BLOG_POSTS),
      getCategoryBySlug(CATEGORY_SLUGS.NOTICIAS),
    ]);
    const ids = [catBlog?.id, catNoticias?.id].filter((id): id is number => !!id);
    if (ids.length > 0) categoryIds = ids;
    else {
      // fallback to parent "blog" category
      const parent = await getCategoryBySlug(CATEGORY_SLUGS.BLOG);
      if (parent) categoryId = parent.id;
    }
  }

  const { items: posts, totalPages, total } = await getPosts({
    page: currentPage,
    perPage: 12,
    categoryId,
    categoryIds,
  });

  const activeTab = TABS.find((t) => t.slug === activeCat) ?? TABS[0];
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
      <div className="mb-8 flex gap-2 border-b border-border">
        {TABS.map((tab) => {
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
          <Spade className="mb-4 h-16 w-16 text-muted-foreground/20" />
          <p className="text-lg text-muted-foreground">
            No hay artículos en {activeTab.label} aún.
          </p>
        </div>
      )}
    </div>
  );
}
