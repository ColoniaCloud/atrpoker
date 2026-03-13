import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground/70" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {/* Categorías */}
      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge key={cat.id} variant="secondary">{cat.name}</Badge>
          ))}
        </div>
      )}

      {/* Título */}
      <h1
        className="mb-6 text-4xl font-black leading-tight text-foreground"
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />

      {/* Meta autor + fecha */}
      <div className="mb-8 flex items-center gap-4">
        {author?.avatar_urls?.["48"] && (
          <Image
            src={author.avatar_urls["48"]}
            alt={author.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-border"
          />
        )}
        <div>
          {author && <p className="text-sm font-medium text-foreground">{author.name}</p>}
          <time dateTime={post.date} className="text-sm text-muted-foreground">
            {formatDate(post.date)}
          </time>
        </div>
      </div>

      <Separator className="mb-8" />

      {/* Imagen destacada */}
      {imageUrl && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-xl">
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

      {/* Contenido WordPress */}
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Volver */}
      <Separator className="mt-12 mb-8" />
      <Button asChild variant="outline">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Blog
        </Link>
      </Button>
    </article>
  );
}
