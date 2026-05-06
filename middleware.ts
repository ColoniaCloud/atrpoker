import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ESCUELA_FREE_SUBCATEGORIES } from "@/lib/types";

// ─── Roles ────────────────────────────────────────────────────────────────────

const STREAMING_ROLES = (
  process.env.STREAMING_ROLES ?? "subscriber,administrator"
)
  .split(",")
  .map((r) => r.trim().toLowerCase());

function hasStreamingAccess(roles: string[]): boolean {
  return roles.some((role) => STREAMING_ROLES.includes(role.toLowerCase()));
}

const ACADEMIA_PREMIUM_ROLES = ["administrator", "editor", "colaborador", "player"];

function hasEscuelaPremiumAccess(roles: string[]): boolean {
  return roles.some((role) => ACADEMIA_PREMIUM_ROLES.includes(role.toLowerCase()));
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export default auth(async function middleware(
  req: NextRequest & { auth: { user: { roles?: string[] } } | null }
) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ── /streaming/* ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/streaming")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const roles = session.user.roles ?? [];
    if (!hasStreamingAccess(roles)) {
      return NextResponse.redirect(new URL("/sin-acceso", req.url));
    }
  }

  // ── /academia/[slug] ─────────────────────────────────────────────────────
  // Solo las páginas individuales (con slug) requieren autenticación.
  // El listado /academia y los archivos de categoría son públicos.
  if (pathname.startsWith("/academia/")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const catSlug = pathname.split("/")[2];
    const isFreeCategory =
      !catSlug || (ESCUELA_FREE_SUBCATEGORIES as readonly string[]).includes(catSlug);

    if (!isFreeCategory) {
      const roles = session.user.roles ?? [];
      if (!hasEscuelaPremiumAccess(roles)) {
        return NextResponse.redirect(new URL("/sin-acceso", req.url));
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/streaming/:path*",
    "/academia/:path*",
  ],
};
