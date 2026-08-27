import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Middleware ───────────────────────────────────────────────────────────────

export default auth(async function middleware(
  req: NextRequest & { auth: { user: { roles?: string[] } } | null }
) {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // ── /streaming/* ─────────────────────────────────────────────────────────
  // Público: visible para cualquier visitante, sin sesión ni rol requeridos.

  // ── /academia/[slug] ─────────────────────────────────────────────────────
  // Cualquier usuario registrado puede ver los videos de Academia.
  // Las restricciones por rol fueron eliminadas: solo se exige sesión iniciada.
  if (pathname.startsWith("/academia/")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── /estudia/* ──────────────────────────────────────────────────────────
  if (pathname.startsWith("/estudia")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── /perfil/* ───────────────────────────────────────────────────────────
  // Requiere sesión iniciada (mensajería, perfil, soporte, admin).
  if (pathname.startsWith("/perfil")) {
    if (!session?.user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/academia/:path*",
    "/estudia/:path*",
    "/estudia",
    "/perfil/:path*",
  ],
};
