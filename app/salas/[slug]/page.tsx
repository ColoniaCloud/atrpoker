import type { Metadata } from "next";
import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Check, X, Trophy, Star,
  Globe, Network, Percent, Gift, DollarSign, BarChart2, ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SalaJugaModal } from "@/components/SalaJugaModal";
import { CopyButton } from "@/components/CopyButton";
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
    openGraph: { title, description, images: imageUrl ? [{ url: imageUrl }] : [] },
  };
}

const WA_NUMBER = "5491124932724";

type ImageObject = { url: string; alt?: string; width?: number; height?: number };

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-amber-400 fill-amber-400" : "text-zinc-600 fill-zinc-600"}`}
        />
      ))}
      <span className="ml-1 text-xs text-zinc-400">({rating}/5)</span>
    </div>
  );
}

// ── Ficha de la sala ────────────────────────────────────────────────────────

interface FichaProps {
  nombre: string;
  acf: NonNullable<ReturnType<typeof extractAcf>>;
}

function extractAcf(acf: Record<string, unknown> | null | undefined) {
  return acf ?? {};
}

function FichaDeLaSala({ nombre, acf }: FichaProps) {
  const {
    red, rakeback, bonificacion, deposito_minimo, permite_trakers,
    beneficio_atr_1, beneficio_atr_2, beneficio_atr_3,
  } = acf as {
    red?: string; rakeback?: string | number; bonificacion?: string;
    deposito_minimo?: string | number; permite_trakers?: boolean | string;
    beneficio_atr_1?: string; beneficio_atr_2?: string; beneficio_atr_3?: string;
  };

  const rows: Array<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = [];

  rows.push({
    icon: <Globe className="h-4 w-4 text-primary" />,
    label: "Nombre",
    value: <span className="font-semibold text-foreground">{nombre}</span>,
  });

  if (red) rows.push({
    icon: <Network className="h-4 w-4 text-blue-400" />,
    label: "Red",
    value: <Badge variant="secondary">{red}</Badge>,
  });

  if (rakeback !== undefined && rakeback !== "") rows.push({
    icon: <Percent className="h-4 w-4 text-amber-400" />,
    label: "Rakeback ATR",
    value: <span className="font-bold text-amber-400">{String(rakeback)}</span>,
  });

  if (bonificacion) rows.push({
    icon: <Gift className="h-4 w-4 text-green-400" />,
    label: "Bono Bienvenida",
    value: <span className="text-sm text-foreground/80">{bonificacion}</span>,
  });

  if (deposito_minimo !== undefined && deposito_minimo !== "") rows.push({
    icon: <DollarSign className="h-4 w-4 text-emerald-400" />,
    label: "Depósito mínimo",
    value: <span className="text-sm text-foreground/80">{String(deposito_minimo)}</span>,
  });

  if (permite_trakers !== undefined && permite_trakers !== "") rows.push({
    icon: <BarChart2 className="h-4 w-4 text-violet-400" />,
    label: "Permite trackers",
    value: (() => {
      const val = String(permite_trakers).toLowerCase();
      const yes = val === "true" || val === "si" || val === "sí" || val === "1";
      return (
        <Badge variant={yes ? "default" : "secondary"} className={yes ? "bg-green-600" : ""}>
          {yes ? "Sí" : "No"}
        </Badge>
      );
    })(),
  });

  const beneficios = [beneficio_atr_1, beneficio_atr_2, beneficio_atr_3].filter(Boolean);

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
              <td className="w-44 px-4 py-3 align-middle">
                <div className="flex items-center gap-2 text-muted-foreground font-medium whitespace-nowrap">
                  {row.icon}
                  {row.label}
                </div>
              </td>
              <td className="px-4 py-3 align-middle">{row.value}</td>
            </tr>
          ))}

          {beneficios.length > 0 && (
            <>
              <tr className="bg-muted/60">
                <td colSpan={2} className="px-4 py-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Beneficios ATR
                  </span>
                </td>
              </tr>
              {beneficios.map((b, i) => (
                <tr key={`ben-${i}`} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                  <td className="w-12 px-4 py-3 align-middle">
                    <Check className="h-4 w-4 text-green-500" />
                  </td>
                  <td className="px-4 py-3 align-middle text-sm text-foreground/80">{b}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function SalaPage({ params }: PageProps) {
  const { slug } = await params;
  const sala = await getSalaBySlug(slug);

  if (!sala) notFound();

  const imageUrl = getFeaturedImageUrl(sala, "full");
  const { acf } = sala;

  const icono = acf?.icono_de_la_sala && typeof acf.icono_de_la_sala === "object"
    ? (acf.icono_de_la_sala as ImageObject)
    : null;

  const logoEntero = acf?.logo_entero && typeof acf.logo_entero === "object"
    ? (acf.logo_entero as ImageObject)
    : null;

  const salaNamePlain = stripHtml(sala.title.rendered);
  const waMessage = encodeURIComponent(`Necesito ayuda para jugar en ${salaNamePlain}`);
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  return (
    <>
      {/* ── Hero full-bleed ─────────────────────────────────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-hidden pt-36 pb-28">
        {imageUrl ? (
          <Image src={imageUrl} alt={salaNamePlain} fill className="object-cover" priority />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/60 to-background animate-fade-in" />

        <div className="relative mx-auto w-full max-w-4xl text-center px-4">
          {/* Badge rakeback */}
          <div className="animate-fade-down" style={{ animationDelay: "0ms" }}>
            <Badge
              variant="outline"
              className="mb-6 gap-2 px-4 py-1.5 text-sm border-amber-500/40 text-amber-400 bg-zinc-950/60"
            >
              <Trophy className="h-3.5 w-3.5" />
              Rakeback ATR:{" "}
              <span className="font-bold">
                {acf?.rakeback ? String(acf.rakeback) : "Consultanos"}
              </span>
            </Badge>
          </div>

          {/* Título con ícono */}
          <h1
            className="mb-8 flex items-center justify-center gap-4 text-5xl font-black leading-tight text-white md:text-6xl animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {icono && (
              <Image
                src={icono.url}
                alt={icono.alt || ""}
                width={56}
                height={56}
                className="object-contain flex-shrink-0"
              />
            )}
            <span dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
          </h1>

          {/* Botones */}
          <div
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <SalaJugaModal
              salaName={salaNamePlain}
              logo={logoEntero}
              instrucciones={acf?.instrucciones}
              linkAfiliado={acf?.link_de_afiliado}
              codigoAfiliado={acf?.codigo_de_afiliado}
              codigoBonificacion={acf?.codigo_de_bonificacion}
              web={acf?.web}
            />
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-bold min-w-[220px] gap-2 h-14 text-base px-8"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                TE ASESORAMOS GRATIS
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Contenido ────────────────────────────────────────────────── */}
      <div className="py-12">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/salas" className="hover:text-foreground transition-colors">Salas</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground/70" dangerouslySetInnerHTML={{ __html: sala.title.rendered }} />
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ── Columna izquierda: Descripción ── */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Descripción de la sala</h2>

            {sala.content.rendered ? (
              <div
                className="wp-content prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: sala.content.rendered }}
              />
            ) : (
              <p className="text-muted-foreground text-sm">Sin descripción disponible.</p>
            )}

            {/* Pros y Contras */}
            {(acf?.pros || acf?.contras) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {acf.pros && (
                  <Card className="border-green-800/40 bg-green-950/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-green-400 text-base">
                        <Check className="h-4 w-4" />Pros
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
                        <X className="h-4 w-4" />Contras
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground/80 whitespace-pre-line">{acf.contras}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* ── Barra de dirección simulada ── */}
            {acf?.web && (
              <div className="mt-8">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                  {/* Dot controls (decorativos) */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
                  </div>
                  {/* URL bar */}
                  <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background/60 px-3 py-1.5 min-w-0">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="flex-1 truncate font-mono text-xs text-muted-foreground select-none">
                      {acf.web}
                    </span>
                  </div>
                  {/* Botón ir a la web */}
                  {acf.link_de_afiliado && (
                    <a
                      href={acf.link_de_afiliado}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="flex-shrink-0 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Ir a la web
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* ── Botones de copiar códigos ── */}
            {(acf?.codigo_de_afiliado || acf?.codigo_de_bonificacion) && (
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {acf.codigo_de_afiliado && (
                  <CopyButton
                    value={acf.codigo_de_afiliado}
                    label="Cód. afiliado:"
                    className="flex-1 py-4 text-base"
                  />
                )}
                {acf.codigo_de_bonificacion && (
                  <CopyButton
                    value={acf.codigo_de_bonificacion}
                    label="Cód. bono:"
                    className="flex-1 py-4 text-base"
                  />
                )}
              </div>
            )}
          </div>

          {/* ── Columna derecha: Ficha + Bono ── */}
          <div className="space-y-6">
            {/* Ficha de la sala */}
            <h2 className="text-2xl font-bold text-foreground">Ficha de la sala</h2>
            <FichaDeLaSala
              nombre={salaNamePlain}
              acf={acf as Record<string, unknown>}
            />

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
                    </div>
                  )}
                  {acf.link_referido && (
                    <Button asChild className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold">
                      <a href={acf.link_referido} target="_blank" rel="noopener noreferrer sponsored">
                        {acf.texto_boton_referido || "Jugar en esta sala"}
                      </a>
                    </Button>
                  )}
                  <p className="text-center text-xs text-muted-foreground/60">
                    Link de referido · El juego puede crear dependencia · +18
                  </p>
                </CardContent>
              </Card>
            )}
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
    </>
  );
}
