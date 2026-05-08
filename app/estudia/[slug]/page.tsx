import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPostBySlug, getProgreso } from "@/lib/wordpress";
import { buildBunnyEmbedUrl } from "@/lib/bunny";
import { ESCUELA_LIBRARY_IDS, ESCUELA_DEFAULT_LIBRARY_ID } from "@/lib/types";
import {
  CURSO_SECTIONS,
  getAllCursoItems,
  getAdjacentSlugs,
} from "@/lib/curso";
import { EstudiaPlayerClient } from "./EstudiaPlayerClient";
import type { Progreso } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Video | Estudia Progresivamente" };
  return {
    title: `${post.title.rendered.replace(/<[^>]+>/g, "")} | Estudia Progresivamente`,
    robots: { index: false },
  };
}

export default async function EstudiaSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/login?callbackUrl=/estudia/${slug}`);
  }

  const allItems = getAllCursoItems();
  const item = allItems.find((i) => i.slug === slug);
  if (!item) notFound();

  const [post, progreso] = await Promise.all([
    getPostBySlug(slug),
    (async (): Promise<Progreso> => {
      const token = (session.user as { wpToken?: string }).wpToken;
      return token ? getProgreso(token) : {};
    })(),
  ]);

  if (!post) notFound();

  // Determinar qué campo ACF tiene el video ID
  const videoId =
    item.videoIdField === "bunny_video_id"
      ? post.acf?.bunny_video_id
      : post.acf?.bunny_video_id_2;

  const libraryId =
    ESCUELA_LIBRARY_IDS[item.subcategory] ?? ESCUELA_DEFAULT_LIBRARY_ID;

  const bunnyUrl = videoId
    ? buildBunnyEmbedUrl(libraryId, videoId)
    : undefined;

  const { prev, next } = getAdjacentSlugs(slug);

  return (
    <EstudiaPlayerClient
      post={post}
      bunnyUrl={bunnyUrl}
      item={item}
      allItems={allItems}
      sections={CURSO_SECTIONS}
      prevSlug={prev}
      nextSlug={next}
      initialProgreso={progreso}
    />
  );
}
