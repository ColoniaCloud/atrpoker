"use client";

interface BunnyPlayerProps {
  videoId: string;
  libraryId: string;
  title?: string;
  autoplay?: boolean;
}

export function BunnyPlayer({
  videoId,
  libraryId,
  title = "Video",
  autoplay = false,
}: BunnyPlayerProps) {
  const src = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=${autoplay}&loop=false&muted=false&preload=true&responsive=true`;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl shadow-black/50">
      <iframe
        src={src}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}

// Versión para streams en vivo (Bunny Stream)
interface BunnyLivePlayerProps {
  pullZone: string;
  streamKey: string;
  title?: string;
}

export function BunnyLivePlayer({ pullZone, streamKey, title = "Stream en vivo" }: BunnyLivePlayerProps) {
  const src = `https://${pullZone}.b-cdn.net/${streamKey}/embed`;

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl shadow-black/50">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        EN VIVO
      </div>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
