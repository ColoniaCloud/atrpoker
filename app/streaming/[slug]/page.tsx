import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getPostBySlug, getCategoryBySlug, stripHtml } from "@/lib/wordpress";
import { CATEGORY_SLUGS, ESCUELA_DEFAULT_LIBRARY_ID } from "@/lib/types";
import { BunnyPlayer } from "@/components/BunnyPlayer";
import { buildBunnyEmbedUrl } from "@/lib/bunny";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Streaming",
};

export async function generateStaticParams() {
  return [];
}

export default async function StreamingPlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const streamingCategory = await getCategoryBySlug(CATEGORY_SLUGS.STREAMING);
  if (streamingCategory && !post.categories.includes(streamingCategory.id)) {
    notFound();
  }

  const { acf } = post;
  const hasVideo = !!acf?.bunny_video_id;
  const isLive = acf?.is_live;

  const bunnyEmbedUrl = hasVideo
    ? buildBunnyEmbedUrl(ESCUELA_DEFAULT_LIBRARY_ID, acf!.bunny_video_id!)
    : undefined;

  return (
    <div className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/streaming" className="hover:text-foreground transition-colors">Streaming</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate text-foreground/70" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {/* Título */}
      <div className="mb-6">
        {isLive && (
          <Badge variant="destructive" className="mb-3 gap-1.5 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-white" />
            EN VIVO
          </Badge>
        )}
        <h1
          className="text-3xl font-black text-foreground"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </div>

      {/* Player */}
      {hasVideo ? (
        <div className="mb-8">
          <BunnyPlayer
            src={bunnyEmbedUrl}
            title={stripHtml(post.title.rendered)}
          />
        </div>
      ) : (
        <div className="mb-8 flex aspect-video items-center justify-center rounded-xl border border-border bg-card">
          <div className="text-center text-muted-foreground">
            <VideoOff className="mx-auto mb-3 h-16 w-16 text-muted-foreground/30" />
            <p>El video no está disponible en este momento.</p>
          </div>
        </div>
      )}

      {/* Descripción */}
      {post.content.rendered && (
        <div
          className="wp-content"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      )}

      <Separator className="mt-10 mb-8" />

      <Button asChild variant="outline">
        <Link href="/streaming">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Streaming
        </Link>
      </Button>
    </div>
  );
}
