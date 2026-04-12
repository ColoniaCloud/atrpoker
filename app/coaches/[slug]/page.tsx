import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ChevronRight, Trophy,
  Instagram, Twitter, Youtube, Twitch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogCard } from "@/components/BlogCard";
import { IconsWallBackground } from "@/components/IconsWallBackground";
import { CoachesCarousel } from "@/components/CoachesCarousel";
import {
  getCoachBySlug, getCoachSlugs, getCoaches, getSalas, getPosts, stripHtml,
} from "@/lib/wordpress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getCoachSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const coach = await getCoachBySlug(slug);
  if (!coach) return { title: "Coach no encontrado" };

  const name = stripHtml(coach.title.rendered);
  const desc =
    coach.acf?.descripcion ??
    coach.acf?.bio ??
    stripHtml(coach.excerpt?.rendered ?? "").slice(0, 160);
  const imageUrl = coach._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  return {
    title: `${name} — Coach de Póker`,
    description: desc,
    openGraph: {
      title: `${name} — Coach de Póker | ATRPoker`,
      description: desc ?? "",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

const WA_NUMBER = "5491124932724";

export default async function CoachPage({ params }: PageProps) {
  const { slug } = await params;

  const [coach, { items: salas }, allCoaches] = await Promise.all([
    getCoachBySlug(slug),
    getSalas({ perPage: 20 }),
    getCoaches(),
  ]);

  if (!coach) notFound();

  const name = stripHtml(coach.title.rendered);
  const { acf } = coach;
  const featuredMedia = coach._embedded?.["wp:featuredmedia"]?.[0];
  const photoUrl = featuredMedia?.source_url ?? null;
  const especialidad = acf?.especialidad ?? acf?.disciplina ?? null;

  // Íconos de salas para el background
  const salaIcons = salas
    .map((s) => s.acf?.icono_de_la_sala)
    .filter(
      (ico): ico is { url: string; alt?: string } =>
        typeof ico === "object" && ico !== null && "url" in ico
    );

  // Posts relacionados al coach (busca por nombre)
  const { items: relatedPosts } = await getPosts({ search: name, perPage: 6 });

  const waMessage = encodeURIComponent(`Hola, quiero información sobre las clases de ${name}`);
  const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${waMessage}`;

  const socials = [
    acf?.instagram && { href: acf.instagram, icon: Instagram, label: "Instagram" },
    acf?.twitter   && { href: acf.twitter,   icon: Twitter,   label: "Twitter / X" },
    acf?.youtube   && { href: acf.youtube,   icon: Youtube,   label: "YouTube" },
    acf?.twitch    && { href: acf.twitch,    icon: Twitch,    label: "Twitch" },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string }[];

  const fichaRows = [
    especialidad              && { label: "Especialidad",        value: especialidad },
    acf?.variantes            && { label: "Variantes",           value: acf.variantes },
    acf?.pais                 && { label: "País",                value: acf.pais },
    acf?.anos_experiencia     && { label: "Años de experiencia", value: String(acf.anos_experiencia) },
    acf?.estilo_de_juego      && { label: "Estilo de juego",     value: acf.estilo_de_juego },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      {/* ── Hero full-bleed con IconsWall como fondo ────────────── */}
      <section className="relative -mt-14 left-1/2 -translate-x-1/2 w-screen overflow-visible pt-36 pb-28">

        {/* Fondo: columnas de logos animadas */}
        <div className="absolute inset-0 overflow-hidden">
          {salaIcons.length > 0 ? (
            <IconsWallBackground logos={salaIcons} />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950" />
          )}
        </div>

        {/* Overlay radial: bordes opacos, centro semitransparente */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(199 85% 5% / 0.5) 0%, hsl(199 85% 5% / 0.65) 35%, hsl(199 85% 5% / 0.92) 70%, hsl(199 85% 5%) 100%)",
          }}
        />

        {/* Contenido del hero */}
        <div className="relative z-10 mx-auto w-full max-w-3xl text-center px-4">
          {especialidad && (
            <div className="animate-fade-down">
              <Badge
                variant="outline"
                className="mb-5 gap-2 px-4 py-1.5 text-sm border-amber-500/40 text-amber-400 bg-zinc-950/60"
              >
                <Trophy className="h-3.5 w-3.5" />
                {especialidad}
              </Badge>
            </div>
          )}

          <h1
            className="mb-5 text-5xl font-black leading-tight text-white md:text-6xl animate-fade-up"
            style={{ animationDelay: "100ms" }}
            dangerouslySetInnerHTML={{ __html: coach.title.rendered }}
          />

          {(acf?.descripcion || acf?.bio) && (
            <p
              className="mx-auto mb-8 max-w-xl text-base text-zinc-300 animate-fade-up"
              style={{ animationDelay: "200ms" }}
            >
              {acf.descripcion ?? acf.bio}
            </p>
          )}

          <div
            className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-up"
            style={{ animationDelay: "300ms" }}
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 hover:bg-green-400 text-white font-bold px-8 py-3.5 transition-colors text-base"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L.057 23.882l6.204-1.628A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.977.994-3.624-.235-.373A9.818 9.818 0 0 1 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
              </svg>
              Contactar al coach
            </a>
            <Link
              href="/academia"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3.5 transition-colors text-base backdrop-blur-sm"
            >
              Ver la Academia
            </Link>
          </div>
        </div>

        {/* Foto del coach — centrada sobre el borde inferior del hero */}
        {photoUrl && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20">
            <div className="h-36 w-36 rounded-full overflow-hidden border-4 border-background shadow-2xl ring-2 ring-amber-500/30">
              <Image
                src={photoUrl}
                alt={name}
                width={144}
                height={144}
                className="object-cover object-top w-full h-full"
                priority
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Contenido ────────────────────────────────────────────────── */}
      {/* pt-20 para dejar espacio a la foto que sobresale del hero */}
      <div className={photoUrl ? "pt-24 pb-12" : "py-12"}>

        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/coaches" className="hover:text-foreground transition-colors">Coaches</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground/70">{name}</span>
        </nav>

        {/* ── Dos columnas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Columna izquierda — descripción */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">Sobre {name}</h2>

            {coach.content?.rendered ? (
              <div
                className="wp-content prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: coach.content.rendered }}
              />
            ) : acf?.bio ? (
              <p className="text-muted-foreground leading-relaxed">{acf.bio}</p>
            ) : (
              <p className="text-muted-foreground text-sm">Sin descripción disponible.</p>
            )}

            {/* Logros */}
            {acf?.logros && (
              <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-amber-400">
                  <Trophy className="h-4 w-4" />
                  Logros destacados
                </h3>
                <p className="text-sm text-foreground/80 whitespace-pre-line leading-relaxed">
                  {acf.logros}
                </p>
              </div>
            )}

            {/* Ficha */}
            {fichaRows.length > 0 && (
              <div className="mt-8 overflow-hidden rounded-xl border border-border">
                <div className="bg-muted/40 px-4 py-2.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Ficha del coach
                  </span>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {fichaRows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <td className="px-4 py-3 font-medium text-muted-foreground whitespace-nowrap w-40">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-foreground/90">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Redes sociales */}
            {socials.length > 0 && (
              <div className="mt-8">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                  Seguir a {name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socials.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card hover:border-amber-500/40 hover:bg-amber-500/5 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-amber-400 transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha — contenido relacionado */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-foreground">
              Contenido de {name}
            </h2>

            {relatedPosts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {relatedPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Próximamente más contenido de {name}.
                </p>
              </div>
            )}

            {/* CTA contacto */}
            <div className="mt-8 rounded-xl border border-green-500/20 bg-green-500/5 p-5 space-y-3">
              <p className="text-sm font-semibold text-green-400">¿Querés tomar clases con {name}?</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Contactanos por WhatsApp y coordinamos horarios y precios.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-green-500 hover:bg-green-400 text-white font-bold text-sm px-5 py-2.5 transition-colors w-full"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.855L.057 23.882l6.204-1.628A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.006-1.371l-.36-.214-3.724.977.994-3.624-.235-.373A9.818 9.818 0 0 1 12 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>

        </div>

        <Separator className="mt-12 mb-10" />

        {/* ── Carrusel de coaches ── */}
        {allCoaches.length > 1 && (
          <div className="mb-10">
            <h2 className="mb-6 text-xl font-bold text-foreground">Conocé al equipo de coaches</h2>
            <CoachesCarousel coaches={allCoaches} currentSlug={slug} />
          </div>
        )}

        <Button asChild variant="outline">
          <Link href="/coaches">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Ver todos los coaches
          </Link>
        </Button>
      </div>
    </>
  );
}
