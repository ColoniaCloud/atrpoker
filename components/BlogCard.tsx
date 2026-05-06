import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Spade } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WPPost } from "@/lib/types";
import { getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";

interface BlogCardProps {
  post: WPPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const imageUrl = getFeaturedImageUrl(post, "medium_large");
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 150);
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const duracion = post.acf?.duracion_del_video;

  return (
    <Card className="group flex flex-col h-full overflow-hidden bg-card border-border hover:border-muted transition-colors duration-200">
      {/* Imagen */}
      <Link href={`/blog/${post.slug}`} className="relative aspect-video overflow-hidden block">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={stripHtml(post.title.rendered)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Spade className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        {/* Badge de duración (clases academia) */}
        {duracion && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {duracion}
          </div>
        )}
      </Link>

      <CardContent className="p-5 flex flex-col flex-1">
        {/* Categoría + fecha */}
        <div className="flex items-center gap-2 mb-3">
          {category && (
            <Badge variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          )}
          <time dateTime={post.date} className="text-xs text-muted-foreground ml-auto">
            {formatDate(post.date)}
          </time>
        </div>

        {/* Título */}
        <h2 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>
            <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{excerpt}</p>
        )}

        {/* Leer más */}
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
        >
          Leer más
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
