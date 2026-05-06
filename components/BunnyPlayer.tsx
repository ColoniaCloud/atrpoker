"use client";

import { cn } from "@/lib/utils";

// ─── Bunny Stream Library ID para "Curso Principiantes" ───────────────────────
// Para usar con otros videos de otras librerías, pasa `libraryId` explícitamente.
// Reemplazá VIDEO_ID con el ID real del video desde el panel de Bunny Stream.
const DEFAULT_LIBRARY_ID = "510800";

// ─── BunnyPlayer ─────────────────────────────────────────────────────────────

interface BunnyPlayerProps {
  /** URL pre-firmada generada server-side con buildBunnyEmbedUrl(). Tiene prioridad sobre videoId/libraryId. */
  src?: string;
  /** ID del video en Bunny Stream (solo si no se pasa src). */
  videoId?: string;
  /** ID de la biblioteca Bunny Stream. Por defecto: 510800 (Curso Principiantes). */
  libraryId?: string;
  /** Título del iframe (accesibilidad). */
  title?: string;
  /** Reproducción automática al cargar. Por defecto: false. */
  autoplay?: boolean;
  /** Silenciar el video. Por defecto: false. */
  muted?: boolean;
  /** Repetir el video al terminar. Por defecto: false. */
  loop?: boolean;
  /** Clases CSS adicionales para el contenedor. */
  className?: string;
}

export function BunnyPlayer({
  src: srcProp,
  videoId,
  libraryId = DEFAULT_LIBRARY_ID,
  title = "Video",
  autoplay = false,
  muted = false,
  loop = false,
  className,
}: BunnyPlayerProps) {
  const params = new URLSearchParams({
    autoplay: String(autoplay),
    muted: String(muted),
    loop: String(loop),
    preload: "true",
    responsive: "true",
  });

  const src = srcProp ?? `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?${params}`;

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/50",
        className
      )}
    >
      <iframe
        src={src}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

// ─── BunnyLivePlayer ─────────────────────────────────────────────────────────
// Versión para streams en vivo via Bunny Stream pull zone.

interface BunnyLivePlayerProps {
  pullZone: string;
  streamKey: string;
  title?: string;
  className?: string;
}

export function BunnyLivePlayer({
  pullZone,
  streamKey,
  title = "Stream en vivo",
  className,
}: BunnyLivePlayerProps) {
  const src = `https://${pullZone}.b-cdn.net/${streamKey}/embed`;

  return (
    <div
      className={cn(
        "relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-2xl shadow-black/50",
        className
      )}
    >
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
        EN VIVO
      </div>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
