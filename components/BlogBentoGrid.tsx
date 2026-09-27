import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Clock, Spade } from "lucide-react";
import type { WPPost } from "@/lib/types";
import { getFeaturedImageUrl, stripHtml, formatDate } from "@/lib/wordpress";
import { cn } from "@/lib/utils";

// ─── Patrón del bento ────────────────────────────────────────────────────────
// Bloque de 6 tiles que ocupa exactamente 10 celdas: hero (2x2) + 4 small (1x1)
// + wide (2x1). En 4 columnas con `grid-flow-row-dense` cada bloque se encastra
// con el siguiente sin dejar huecos (12 entradas = 5 filas completas).
type TileSize = "hero" | "wide" | "small";

const PATTERN: TileSize[] = ["hero", "small", "small", "small", "small", "wide"];

const SIZE_CLASSES: Record<TileSize, string> = {
  hero: "row-span-2 sm:col-span-2 sm:row-span-2",
  wide: "sm:col-span-2",
  small: "",
};

const SIZE_IMAGE_SIZES: Record<TileSize, string> = {
  hero: "(max-width: 1024px) 100vw, 45vw",
  wide: "(max-width: 1024px) 100vw, 45vw",
  small: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw",
};

const WP_IMAGE_SIZE: Record<TileSize, string> = {
  hero: "large",
  wide: "large",
  small: "medium_large",
};

interface BlogBentoGridProps {
  posts: WPPost[];
  className?: string;
}

export function BlogBentoGrid({ posts, className }: BlogBentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-flow-row-dense grid-cols-1 gap-4",
        "auto-rows-[200px] sm:grid-cols-2 sm:auto-rows-[190px] lg:grid-cols-4 lg:auto-rows-[215px]",
        className
      )}
    >
      {posts.map((post, i) => (
        <BentoPostCard key={post.id} post={post} size={PATTERN[i % PATTERN.length]} />
      ))}
    </div>
  );
}

function BentoPostCard({ post, size }: { post: WPPost; size: TileSize }) {
  const imageUrl = getFeaturedImageUrl(post, WP_IMAGE_SIZE[size]);
  const plainTitle = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 180);
  const category = post._embedded?.["wp:term"]?.[0]?.[0];
  const duracion = post.acf?.duracion_del_video;
  const isHero = size === "hero";
  const isWide = size === "wide";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        "group relative isolate flex flex-col justify-end overflow-hidden rounded-xl",
        "border border-border bg-card transition-colors duration-200",
        "hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        SIZE_CLASSES[size]
      )}
    >
      {/* Imagen de fondo */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={plainTitle}
          fill
          sizes={SIZE_IMAGE_SIZES[size]}
          className="absolute inset-0 -z-10 object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-secondary">
          <Spade className={cn("text-muted-foreground/25", isHero ? "h-20 w-20" : "h-10 w-10")} />
        </div>
      )}

      {/* Degradado para legibilidad del texto */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t",
          isHero || isWide
            ? "from-black/95 via-black/55 to-black/10"
            : "from-black/95 via-black/60 to-black/20"
        )}
      />

      {/* Duración (clases con video) */}
      {duracion && (
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          {duracion}
        </div>
      )}

      {/* Contenido */}
      <div className={cn("relative flex flex-col gap-2", isHero ? "p-6" : "p-4")}>
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide">
          {category && (
            <span className="rounded-full bg-primary/90 px-2 py-0.5 font-semibold text-primary-foreground">
              {category.name}
            </span>
          )}
          <time dateTime={post.date} className="text-white/60 normal-case tracking-normal">
            {formatDate(post.date)}
          </time>
        </div>

        <h3
          className={cn(
            "font-bold text-white transition-colors group-hover:text-primary",
            isHero
              ? "text-2xl lg:text-3xl line-clamp-3"
              : isWide
                ? "text-lg line-clamp-2"
                : "text-sm line-clamp-3"
          )}
        >
          <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        </h3>

        {isHero && excerpt && (
          <p className="text-sm text-white/70 line-clamp-2">{excerpt}</p>
        )}

        {(isHero || isWide) && (
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Leer más
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        )}
      </div>
    </Link>
  );
}
