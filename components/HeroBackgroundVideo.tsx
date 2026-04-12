import React from "react";

export function HeroBackgroundVideo() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 w-full h-full overflow-hidden">
      <video
        className="w-full h-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-[#021118] opacity-80" />
    </div>
  );
}
