import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Clock, Lock } from "lucide-react";
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
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { auth } from "@/lib/auth";
import { buildBunnyEmbedUrl } from "@/lib/bunny";
import {
  ESCUELA_SUBCATEGORIES,
  ESCUELA_LIBRARY_IDS,
  ESCUELA_DEFAULT_LIBRARY_ID,
  ESCUELA_FREE_SUBCATEGORIES,
} from "@/lib/types";

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
  const canonicalUrl = `https://atrpoker.com/blog/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.date_gmt,
      modifiedTime: post.modified,
      images: imageUrl ? [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }] : [{
        url: "https://atrpoker.com/brand/Isologotipo.webp",
        width: 1200,
        height: 630,
        alt: title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : ["https://atrpoker.com/brand/Isologotipo.webp"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, session] = await Promise.all([getPostBySlug(slug), auth()]);

  if (!post) notFound();

  const imageUrl = getFeaturedImageUrl(post, "full");
  const author = post._embedded?.author?.[0];
  const categories = post._embedded?.["wp:term"]?.[0] ?? [];

  // ── Resolver subcategoría de Escuela y library ID ───────────────────────
  const escuelaSlugs = ESCUELA_SUBCATEGORIES.map((s) => s.slug) as string[];
  const escuelaCatSlug = categories.find((cat) =>
    escuelaSlugs.includes(cat.slug)
  )?.slug ?? null;

  const libraryId = escuelaCatSlug
    ? (ESCUELA_LIBRARY_IDS[escuelaCatSlug] ?? ESCUELA_DEFAULT_LIBRARY_ID)
    : undefined;

  // ── Elegir campos de video y duración según la subcategoría ────────────
  // curso-principiantes / yoga → bunny_video_id + duracion_del_video
  // resto de escuela           → bunny_video_id_2 + duracion_de_la_clase
  const isFreeEscuela = escuelaCatSlug
    ? (ESCUELA_FREE_SUBCATEGORIES as readonly string[]).includes(escuelaCatSlug)
    : false;

  const videoId = isFreeEscuela
    ? post.acf?.bunny_video_id
    : (escuelaCatSlug ? post.acf?.bunny_video_id_2 : post.acf?.bunny_video_id);

  const duracion = isFreeEscuela
    ? post.acf?.duracion_del_video
    : (escuelaCatSlug ? post.acf?.duracion_de_la_clase : post.acf?.duracion_del_video);

  const hasVideo = !!videoId;

  const bunnyEmbedUrl = hasVideo && libraryId
    ? buildBunnyEmbedUrl(libraryId, videoId!, {})
    : undefined;

  // ── Control de acceso al video ───────────────────────────────────────────
  // Los videos de Academia están disponibles para cualquier usuario registrado.
  // El gating por progreso vive en /estudia/[slug] (Estudia Progresivamente).
  let videoAccessGranted = true;

  if (hasVideo && escuelaCatSlug) {
    videoAccessGranted = !!session?.user;
  }

  return (
    <article className="mx-auto max-w-3xl py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3 w-3" />
        {escuelaCatSlug ? (
          <>
            <Link href="/academia" className="hover:text-foreground transition-colors">Academia</Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/academia/${escuelaCatSlug}`}
              className="hover:text-foreground transition-colors"
            >
              {ESCUELA_SUBCATEGORIES.find((s) => s.slug === escuelaCatSlug)?.label}
            </Link>
          </>
        ) : (
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        )}
        <ChevronRight className="h-3 w-3" />
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

      {/* Duración (posts de Academia) */}
      {duracion && (
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Duración: <strong className="text-foreground">{duracion}</strong></span>
        </div>
      )}

      {/* Video / imagen destacada */}
      {hasVideo ? (
        videoAccessGranted ? (
          <div className="mb-10">
            <BunnyPlayer
              src={bunnyEmbedUrl}
              title={stripHtml(post.title.rendered)}
            />
          </div>
        ) : (
          <LockedVideo isLoggedIn={!!session?.user} postSlug={slug} />
        )
      ) : (
        imageUrl && (
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
        )
      )}

      {/* Contenido WordPress */}
      <div
        className="wp-content"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />

      {/* Volver */}
      <Separator className="mt-12 mb-8" />
      <Button asChild variant="outline">
        <Link href={escuelaCatSlug ? `/academia/${escuelaCatSlug}` : "/blog"}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {escuelaCatSlug ? "Volver a Academia" : "Volver al Blog"}
        </Link>
      </Button>
    </article>
  );
}

// ─── Locked Video Overlay ─────────────────────────────────────────────────────

function LockedVideo({ isLoggedIn, postSlug }: { isLoggedIn: boolean; postSlug: string }) {
  return (
    <div className="mb-10 flex aspect-video items-center justify-center rounded-xl border border-border bg-card">
      <div className="flex flex-col items-center gap-4 px-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Lock className="h-7 w-7 text-muted-foreground" />
        </div>
        {isLoggedIn ? (
          <>
            <div>
              <p className="font-semibold text-foreground">Contenido exclusivo para miembros</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tu cuenta no tiene acceso a este contenido.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href="https://wa.me/5491124932724" target="_blank" rel="noopener noreferrer">
                Contactar para obtener acceso
              </Link>
            </Button>
          </>
        ) : (
          <>
            <div>
              <p className="font-semibold text-foreground">Iniciá sesión para ver este video</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Este contenido es exclusivo para miembros registrados.
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={`/login?callbackUrl=/blog/${encodeURIComponent(postSlug)}`}>
                Iniciar sesión
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
