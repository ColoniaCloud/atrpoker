import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPostSlugs, getCategoryBySlug, stripHtml } from "@/lib/wordpress";
import { CATEGORY_SLUGS } from "@/lib/types";
import { BunnyPlayer } from "@/components/BunnyPlayer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const metadata: Metadata = {
  title: "Streaming",
  robots: { index: false },
};

export async function generateStaticParams() {
  // Solo pre-generamos los slugs de la categoría streaming
  // En producción se puede optimizar con ISR
  return [];
}

export default async function StreamingPlayerPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  // Verificar que la entrada pertenece a la categoría de streaming
  const streamingCategory = await getCategoryBySlug(CATEGORY_SLUGS.STREAMING);
  if (streamingCategory && !post.categories.includes(streamingCategory.id)) {
    notFound();
  }

  const { acf } = post;
  const hasVideo = acf?.bunny_video_id && acf?.bunny_library_id;
  const isLive = acf?.is_live;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
        <Link href="/streaming" className="hover:text-zinc-300">Streaming</Link>
        <span>/</span>
        <span className="text-zinc-400 truncate" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
      </nav>

      {/* Título */}
      <div className="mb-6">
        {isLive && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/30 border border-red-800/50 text-red-400 text-sm font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            EN VIVO
          </div>
        )}
        <h1
          className="text-3xl font-black text-white"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />
      </div>

      {/* Player */}
      {hasVideo ? (
        <div className="mb-8">
          <BunnyPlayer
            videoId={acf!.bunny_video_id!}
            libraryId={acf!.bunny_library_id!}
            title={stripHtml(post.title.rendered)}
          />
        </div>
      ) : (
        <div className="aspect-video rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-8">
          <div className="text-center text-zinc-500">
            <svg className="w-16 h-16 mx-auto mb-3 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
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

      {/* Volver */}
      <div className="mt-10 pt-8 border-t border-zinc-800">
        <Link href="/streaming" className="btn-outline">
          ← Volver al Streaming
        </Link>
      </div>
    </div>
  );
}
