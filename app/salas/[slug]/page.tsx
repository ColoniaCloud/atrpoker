import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Check, X, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/salas" className="hover:text-foreground transition-colors">Salas</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground/70" dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Contenido principal ── */}
        <div className="lg:col-span-2">
          {/* Imagen */}
          {imageUrl && (
            <div className="relative mb-6 aspect-video overflow-hidden rounded-xl">
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
              <Badge variant="outline" className="mb-3">{acf.pais}</Badge>
            )}
            <h1
              className="mb-3 text-4xl font-black text-foreground"
              dangerouslySetInnerHTML={{ __html: sala.title.rendered }}
            />
            {acf?.rating && <StarRating rating={acf.rating} />}
          </div>

          <Separator className="mb-8" />

          {/* Contenido WordPress */}
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: sala.content.rendered }}
          />

          {/* Pros y Contras */}
          {(acf?.pros || acf?.contras) && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {acf.pros && (
                <Card className="border-green-800/40 bg-green-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-green-400 text-base">
                      <Check className="h-4 w-4" />
                      Pros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-line">{acf.pros}</p>
                  </CardContent>
                </Card>
              )}
              {acf.contras && (
                <Card className="border-red-800/40 bg-red-950/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-destructive text-base">
                      <X className="h-4 w-4" />
                      Contras
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 whitespace-pre-line">{acf.contras}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            {/* Card de bono */}
            {(acf?.codigo_bono || acf?.link_referido) && (
              <Card className="border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-base text-foreground">Oferta Exclusiva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {acf.descripcion_bono && (
                    <p className="text-sm text-muted-foreground">{acf.descripcion_bono}</p>
                  )}

                  {acf.codigo_bono && (
                    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                      <p className="text-xs font-medium text-amber-500 mb-1">Código de bono</p>
                      <p className="font-mono text-xl font-black text-amber-400">{acf.codigo_bono}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Copiá y usá al registrarte</p>
                    </div>
                  )}

                  {acf.link_referido && (
                    <Button
                      asChild
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold"
                    >
                      <a href={acf.link_referido} target="_blank" rel="noopener noreferrer sponsored">
                        {acf.texto_boton_referido || "Jugar en esta sala"}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}

                  <p className="text-center text-xs text-muted-foreground/60">
                    Link de referido · El juego puede crear dependencia · +18
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Plataformas */}
            {acf?.plataformas && acf.plataformas.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Plataformas disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {acf.plataformas.map((p) => (
                      <Badge key={p} variant="secondary" className="capitalize">{p}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Variantes */}
            {acf?.variantes_poker && acf.variantes_poker.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Variantes de póker</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {acf.variantes_poker.map((v) => (
                      <Badge key={v} variant="outline" className="text-primary border-primary/30">{v}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Separator className="mt-12 mb-8" />
      <Button asChild variant="outline">
        <Link href="/salas">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ver todas las salas
        </Link>
      </Button>
    </div>
  );
}
