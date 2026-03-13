import Link from "next/link";
import Image from "next/image";
import type { WPSala } from "@/lib/types";
import { getFeaturedImageUrl, stripHtml } from "@/lib/wordpress";

interface SalaCardProps {
  sala: WPSala;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-gold-400" : "text-zinc-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function SalaCard({ sala }: SalaCardProps) {
  const imageUrl = getFeaturedImageUrl(sala, "medium");
  const excerpt = stripHtml(sala.excerpt?.rendered ?? "").slice(0, 120);
  const { acf } = sala;

  return (
    <article className="card group flex flex-col h-full">
      {/* Imagen */}
      <Link href={`/salas/${sala.slug}`} className="relative h-40 overflow-hidden bg-zinc-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={sala.title.rendered}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl text-zinc-700">♣</span>
          </div>
        )}
        {/* Estado */}
        {acf?.estado && acf.estado !== "activa" && (
          <div className="absolute top-2 right-2">
            <span className="badge bg-red-900/80 text-red-300 border border-red-800">
              {acf.estado}
            </span>
          </div>
        )}
      </Link>

      {/* Contenido */}
      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        {acf?.rating && (
          <div className="mb-2">
            <StarRating rating={acf.rating} />
          </div>
        )}

        {/* País */}
        {acf?.pais && (
          <span className="badge bg-zinc-800 text-zinc-400 border border-zinc-700 mb-2">
            {acf.pais}
          </span>
        )}

        {/* Título */}
        <h2 className="text-lg font-bold text-zinc-100 mb-2 group-hover:text-gold-400 transition-colors">
          <Link href={`/salas/${sala.slug}`}>
            <span dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
          </Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-sm text-zinc-400 line-clamp-2 flex-1">{excerpt}</p>
        )}

        {/* Bono destacado */}
        {acf?.codigo_bono && (
          <div className="mt-3 p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/20">
            <p className="text-xs text-gold-400 font-medium">Código de bono</p>
            <p className="text-sm font-mono font-bold text-gold-300 mt-0.5">
              {acf.codigo_bono}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 flex gap-2">
          {acf?.link_referido ? (
            <a
              href={acf.link_referido}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="btn-gold text-sm py-2 px-4 flex-1 justify-center"
            >
              {acf.texto_boton_referido || "Jugar ahora"}
            </a>
          ) : null}
          <Link
            href={`/salas/${sala.slug}`}
            className="btn-outline text-sm py-2 px-4 flex-1 justify-center"
          >
            Ver reseña
          </Link>
        </div>
      </div>
    </article>
  );
}
