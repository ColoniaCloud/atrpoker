// Página de ejemplo para BunnyPlayer — Curso Principiantes (Library ID: 510800)
// Reemplazá "example-video-id" con el ID real del video desde el panel de Bunny Stream.
// Podés encontrar el Video ID en: https://dash.bunny.net → Stream → tu biblioteca → video

import { BunnyPlayer } from "@/components/BunnyPlayer";

export default function VideoExamplePage() {
  return (
    <div className="py-12 max-w-3xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black mb-2">Curso Principiantes — Demo</h1>
        <p className="text-muted-foreground text-sm">
          Componente <code className="bg-muted px-1 rounded text-xs">BunnyPlayer</code> usando
          la Library ID <strong>510800</strong>.
        </p>
      </div>

      {/* Ejemplo básico — reemplazá el videoId con el ID real */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reproducción normal</h2>
        <BunnyPlayer
          videoId="example-video-id"
          // libraryId omitido → usa el default 510800
        />
      </section>

      {/* Ejemplo con autoplay y muted */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Autoplay + Muted</h2>
        <BunnyPlayer
          videoId="example-video-id"
          autoplay
          muted
        />
      </section>

      {/* Ejemplo con loop y className personalizado */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Loop + borde personalizado</h2>
        <BunnyPlayer
          videoId="example-video-id"
          loop
          className="ring-2 ring-primary"
        />
      </section>
    </div>
  );
}
