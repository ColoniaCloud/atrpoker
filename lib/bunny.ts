import { createHash } from "crypto";

const TOKEN_TTL_SECONDS = 3600; // 1 hora

/**
 * Builds a Bunny Stream embed URL. If a token key env var exists for the
 * library (BUNNY_TOKEN_KEY_{libraryId}), signs the URL with token + expires.
 * Must be called from a server component or server action.
 */
export function buildBunnyEmbedUrl(
  libraryId: string,
  videoId: string,
  options: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {}
): string {
  const { autoplay = false, muted = false, loop = false } = options;

  const params = new URLSearchParams({
    autoplay: String(autoplay),
    muted: String(muted),
    loop: String(loop),
    preload: "true",
    responsive: "true",
  });

  const tokenKey = process.env[`BUNNY_TOKEN_KEY_${libraryId}`];

  if (tokenKey) {
    const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
    const token = createHash("sha256")
      .update(tokenKey + videoId + expires)
      .digest("hex");
    params.set("token", token);
    params.set("expires", String(expires));
  }

  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?${params}`;
}
