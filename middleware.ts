import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STREAMING_ROLES = (
  process.env.STREAMING_ROLES ?? "subscriber,administrator"
)
  .split(",")
  .map((r) => r.trim().toLowerCase());

function hasStreamingAccess(roles: string[]): boolean {
  return roles.some((role) => STREAMING_ROLES.includes(role.toLowerCase()));
}

export default auth(async function middleware(req: NextRequest & { auth: { user: { roles?: string[] } } | null }) {
  const { pathname } = req.nextUrl;

  // Proteger todas las rutas de streaming
  if (pathname.startsWith("/streaming")) {
    const session = req.auth;

    if (!session?.user) {
      // No autenticado → redirigir al login
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const roles = session.user.roles ?? [];
    if (!hasStreamingAccess(roles)) {
      // Autenticado pero sin acceso → página de sin acceso
      return NextResponse.redirect(new URL("/sin-acceso", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/streaming/:path*",
    // Agregar más rutas protegidas aquí si es necesario
  ],
};
