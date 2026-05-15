/**
 * Resuelve la URL pública del sitio (canónica) priorizando:
 * 1. `NEXT_PUBLIC_SITE_URL` (variable explícita que vos configurás en Vercel)
 * 2. `VERCEL_PROJECT_PRODUCTION_URL` (la inyecta Vercel en builds de producción)
 * 3. `NEXTAUTH_URL` solo si NO es localhost (NextAuth lo usa para callbacks; en
 *    Vercel suele quedar como `http://localhost:3000` por error y contamina
 *    metadataBase / sitemap / robots → genera prompts de Private Network Access
 *    en producción y links rotos)
 * 4. Fallback: `https://atrpoker.com`
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && !explicit.includes("localhost") && !explicit.includes("127.0.0.1")) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  const nextauth = process.env.NEXTAUTH_URL?.trim();
  if (
    nextauth &&
    !nextauth.includes("localhost") &&
    !nextauth.includes("127.0.0.1")
  ) {
    return nextauth.replace(/\/$/, "");
  }

  return "https://atrpoker.com";
}
