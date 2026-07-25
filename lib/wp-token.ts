import "server-only";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

// ─── Acceso server-only al JWT de WordPress ─────────────────────────────────
// El JWT de WP se guarda dentro del token de NextAuth (cookie cifrada), NO en
// la sesión que se envía al browser. Esto evita exponerlo vía useSession() /
// /api/auth/session. Solo el servidor puede leerlo, descifrando la cookie.
//
// Se usa desde route handlers y server components. Nunca desde el cliente
// (el import "server-only" lo garantiza en tiempo de build).

const SECRET = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

/**
 * Devuelve el JWT de WordPress del usuario autenticado, o null si no hay sesión.
 *
 * Prueba con y sin el prefijo "__Secure-" del cookie de Auth.js para funcionar
 * tanto en desarrollo (http) como en producción (https) sin configuración extra.
 * getToken() devuelve null (no lanza) cuando el cookie no coincide.
 */
export async function getWpToken(): Promise<string | null> {
  if (!SECRET) return null;

  const store = await cookies();
  const cookieHeader = store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
  const req = { headers: { cookie: cookieHeader } };

  for (const secureCookie of [true, false]) {
    const token = await getToken({ req, secret: SECRET, secureCookie });
    const wpToken = token?.wpToken as string | undefined;
    if (wpToken) return wpToken;
  }

  return null;
}
