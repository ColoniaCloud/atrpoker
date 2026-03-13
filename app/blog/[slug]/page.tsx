import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getPostBySlug,
  getPostSlugs,
  getFeaturedImageUrl,
  formatDate,
  stripHtml,
} from "@/lib/wordpress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Artículo no encontrado" };

  const imageUrl = getFeaturedImageUrl(post, "large");
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const title = stripHtml(post.title.rendered);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date_gmt,
      modifiedTime: post.modified,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const imageUrl = getFeaturedImageUrl(post, "full");
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-300">Inicio</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-zinc-300">Blog</Link>
        <span>/</span>
        <span className="text-zinc-400 truncate" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {/* Categorías */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="badge bg-brand-900/50 text-brand-300 border border-brand-800"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}

      {/* Título */}
      <h1
        className="text-4xl font-black text-white leading-tight mb-6"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {/* Meta */}
      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
        {author?.avatar_urls?.["48"] && (
          <Image
            src={author.avatar_urls["48"]}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          {author && (
            <p className="text-sm font-medium text-zinc-300">{author.name}</p>
          )}
          <time dateTime={post.date} className="text-sm text-zinc-500">
            {formatDate(post.date)}
          </time>
        </div>
      </div>

      {/* Imagen destacada */}
      {imageUrl && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-10">
          <Image
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* Contenido */}
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Back */}
      <div className="mt-12 pt-8 border-t border-zinc-800">
        <Link href="/blog" className="btn-outline">
          ← Volver al Blog
        </Link>
      </div>
    </article>
  );
}
