import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getSalaBySlug,
  getSalaSlugs,
  getFeaturedImageUrl,
  stripHtml,
} from "@/lib/wordpress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getSalaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sala = await getSalaBySlug(slug);
  if (!sala) return { title: "Sala no encontrada" };

  const imageUrl = getFeaturedImageUrl(sala, "large");
  const description = stripHtml(sala.excerpt?.rendered ?? "").slice(0, 160);
  const title = `${stripHtml(sala.title.rendered)} — Reseña y Bono`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`${sizes[size]} ${i < rating ? "text-gold-400" : "text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-zinc-400 text-sm">({rating}/5)</span>
    </div>
  );
}

export default async function SalaPage({ params }: PageProps) {
  const { slug } = await params;
  const sala = await getSalaBySlug(slug);

  if (!sala) notFound();

  const imageUrl = getFeaturedImageUrl(sala, "full");
  const { acf } = sala;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
        <Link href="/" className="hover:text-zinc-300">Inicio</Link>
        <span>/</span>
        <Link href="/salas" className="hover:text-zinc-300">Salas</Link>
        <span>/</span>
        <span className="text-zinc-400 truncate" dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          {/* Imagen */}
          {imageUrl && (
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6">
              <Image
                src={imageUrl}
                alt={stripHtml(sala.title.rendered)}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
                priority
              />
            </div>
          )}

          {/* Título + rating */}
          <div className="mb-6">
            {acf?.pais && (
              <span className="badge bg-zinc-800 text-zinc-400 border border-zinc-700 mb-3">
                {acf.pais}
              </span>
            )}
            <h1
              className="text-4xl font-black text-white mb-3"
              dangerouslySetInnerHTML={{ __html: sala.title.rendered }}
            />
            {acf?.rating && <StarRating rating={acf.rating} size="lg" />}
          </div>

          {/* Contenido del review */}
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: sala.content.rendered }}
          />

          {/* Pros y Contras */}
          {(acf?.pros || acf?.contras) && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {acf.pros && (
                <div className="p-4 rounded-lg bg-green-900/20 border border-green-800/30">
                  <h3 className="font-bold text-green-400 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Pros
                  </h3>
                  <p className="text-sm text-zinc-300 whitespace-pre-line">{acf.pros}</p>
                </div>
              )}
              {acf.contras && (
                <div className="p-4 rounded-lg bg-red-900/20 border border-red-800/30">
                  <h3 className="font-bold text-red-400 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Contras
                  </h3>
                  <p className="text-sm text-zinc-300 whitespace-pre-line">{acf.contras}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar de acción */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Card de bono */}
            {(acf?.codigo_bono || acf?.link_referido) && (
              <div className="card p-5 border-gold-500/30">
                <h2 className="font-bold text-white mb-4">Oferta Exclusiva</h2>

                {acf.descripcion_bono && (
                  <p className="text-sm text-zinc-400 mb-4">{acf.descripcion_bono}</p>
                )}

                {acf.codigo_bono && (
                  <div className="p-3 rounded-lg bg-gold-500/10 border border-gold-500/30 mb-4 text-center">
                    <p className="text-xs text-gold-500 font-medium mb-1">Código de bono</p>
                    <p className="text-xl font-mono font-black text-gold-300">
                      {acf.codigo_bono}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Copiá y usá al registrarte</p>
                  </div>
                )}

                {acf.link_referido && (
                  <a
                    href={acf.link_referido}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="btn-gold w-full justify-center"
                  >
                    {acf.texto_boton_referido || "Jugar en esta sala"}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}

                <p className="text-xs text-zinc-600 mt-3 text-center">
                  Link de referido. El juego puede crear dependencia. +18.
                </p>
              </div>
            )}

            {/* Plataformas */}
            {acf?.plataformas && acf.plataformas.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-zinc-300 mb-3 text-sm">Plataformas disponibles</h3>
                <div className="flex flex-wrap gap-2">
                  {acf.plataformas.map((p) => (
                    <span key={p} className="badge bg-zinc-800 text-zinc-400 border border-zinc-700 capitalize">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Variantes */}
            {acf?.variantes_poker && acf.variantes_poker.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-zinc-300 mb-3 text-sm">Variantes de póker</h3>
                <div className="flex flex-wrap gap-2">
                  {acf.variantes_poker.map((v) => (
                    <span key={v} className="badge bg-brand-900/40 text-brand-300 border border-brand-800">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-zinc-800">
        <Link href="/salas" className="btn-outline">
          ← Ver todas las salas
        </Link>
      </div>
    </div>
  );
}
