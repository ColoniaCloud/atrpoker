import Link from "next/link";
import Image from "next/image";
import type { WPPost } from "@/lib/types";
import { getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";

interface BlogCardProps {
  post: WPPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = getFeaturedImageUrl(post, "medium_large");
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 150);
  const category = post._embedded?.["wp:term"]?.[0]?.[0];

  return (
    <article className="card group flex flex-col h-full">
      {/* Imagen */}
      <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <span className="text-4xl text-zinc-600">♠</span>
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        {/* Categoría + fecha */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <span className="badge bg-brand-900/50 text-brand-300 border border-brand-800">
              {category.name}
            </span>
          )}
          <time
            dateTime={post.date}
            className="text-xs text-zinc-500 ml-auto"
          >
            {formatDate(post.date)}
          </time>
        </div>

        {/* Título */}
        <h2 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-brand-400 transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-zinc-400 line-clamp-3 flex-1">{excerpt}</p>
        )}

        {/* Leer más */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
        >
          Leer más
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
