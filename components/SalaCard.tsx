import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { WPSala } from "@/lib/types";
import { getFeaturedImageUrl, stripHtml } from "@/lib/wordpress";

interface SalaCardProps {
  sala: WPSala;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? "fill-gold-400 text-gold-400" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export function SalaCard({ sala }: SalaCardProps) {
  const imageUrl = getFeaturedImageUrl(sala, "medium");
  const excerpt = stripHtml(sala.excerpt?.rendered ?? "").slice(0, 120);
  const { acf } = sala;

  return (
    <Card className="group flex flex-col h-full overflow-hidden bg-card border-border hover:border-muted transition-colors duration-200">
      {/* Imagen */}
      <Link href={`/salas/${sala.slug}`} className="relative h-40 overflow-hidden block bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={stripHtml(sala.title.rendered)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl text-muted-foreground">♣</span>
          </div>
        )}
        {acf?.estado && acf.estado !== "activa" && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive" className="capitalize">{acf.estado}</Badge>
          </div>
        )}
      </Link>

      <CardContent className="p-4 flex flex-col flex-1">
        {/* Rating + país */}
        <div className="flex items-center justify-between mb-2">
          {acf?.rating && <StarRating rating={acf.rating} />}
          {acf?.pais && (
            <Badge variant="outline" className="text-xs">{acf.pais}</Badge>
          )}
        </div>

        {/* Título */}
        <h2 className="text-base font-bold text-foreground mb-1.5 group-hover:text-gold-400 transition-colors">
          <Link href={`/salas/${sala.slug}`}>
            <span dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
          </Link>
        </h2>

        {/* Excerpt */}
        {excerpt && (
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{excerpt}</p>
        )}

        {/* Código de bono */}
        {acf?.codigo_bono && (
          <div className="mt-3 p-2.5 rounded-lg bg-gold-500/10 border border-gold-500/20">
            <p className="text-xs text-gold-400 font-medium">Código de bono</p>
            <p className="text-sm font-mono font-bold text-gold-400 mt-0.5">{acf.codigo_bono}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="mt-3 flex gap-2">
          {acf?.link_referido && (
            <Button asChild size="sm" className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs h-8">
              <a href={acf.link_referido} target="_blank" rel="noopener noreferrer sponsored">
                {acf.texto_boton_referido || "Jugar ahora"}
              </a>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs h-8">
            <Link href={`/salas/${sala.slug}`}>Ver reseña</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
