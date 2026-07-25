// Helper para route handlers: obtiene el JWT de WP del usuario autenticado.
// Centraliza el patrón repetido en las rutas de /api/mensajes/* y /api/progreso.
//
// El token se lee server-side desde el JWT cifrado (getWpToken), nunca de la
// sesión que va al cliente.

import { auth } from "@/lib/auth";
import { getWpToken } from "@/lib/wp-token";
import { NextResponse } from "next/server";

type TokenOk = { ok: true; token: string };
type TokenErr = { ok: false; response: NextResponse };

/**
 * Devuelve el JWT de WordPress del usuario autenticado, o una respuesta 401
 * lista para retornar desde el route handler.
 */
export async function requireWpToken(): Promise<TokenOk | TokenErr> {
  const token = await getWpToken();
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }

  return { ok: true, token };
}

/**
 * Igual que requireWpToken pero exige rol administrator. El endpoint de WP
 * revalida con current_user_can('manage_options') — defensa en profundidad.
 */
export async function requireAdmin(): Promise<TokenOk | TokenErr> {
  const session = await auth();
  const roles = (session?.user?.roles ?? []).map((r) => r.toLowerCase());
  if (!roles.includes("administrator")) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Sin permiso" }, { status: 403 }),
    };
  }

  const token = await getWpToken();
  if (!token) {
    return {
      ok: false,
      response: NextResponse.json({ error: "No autenticado" }, { status: 401 }),
    };
  }

  return { ok: true, token };
}
