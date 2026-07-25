// ─── Capa de acceso a datos: Mensajería interna ─────────────────────────────
// Aísla el backend detrás de esta interfaz para poder migrar de WordPress a
// otra fuente (p. ej. Supabase) sin tocar las rutas ni la UI.
//
// Requiere endpoints custom en WordPress:
//   /wp-json/atrpoker/v1/mensajes/* y /usuarios/buscar
// Ver: /documentos/register-mensajes-endpoint.php (ignorado por git)
//
// Todas las funciones reciben el JWT de WP (obtenido server-side desde la
// sesión de NextAuth) y usan cache: "no-store" — la mensajería nunca se cachea.

import type {
  ConversacionResumen,
  HiloRespuesta,
  Mensaje,
  NotificarDatos,
  ReporteModeracion,
  UsuarioPublico,
} from "./types";

const WP_URL = process.env.WORDPRESS_URL || "https://atr.academy";
const BASE = `${WP_URL}/wp-json/atrpoker/v1`;

/** Resultado uniforme: ok con dato, o error con mensaje y status. */
export type Resultado<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/** GET genérico que devuelve un fallback ante cualquier fallo (para listas). */
async function getJson<T>(
  url: string,
  token: string,
  fallback: T
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: authHeaders(token),
      cache: "no-store",
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** POST genérico que preserva el status y el mensaje de error del backend. */
async function postJson<T>(
  url: string,
  token: string,
  body?: unknown
): Promise<Resultado<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: authHeaders(token),
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error =
        (data as { message?: string } | null)?.message ??
        "No se pudo completar la acción";
      return { ok: false, status: res.status, error };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, status: 500, error: "Error de red" };
  }
}

// ─── Lecturas ────────────────────────────────────────────────────────────────

export function getConversaciones(
  token: string
): Promise<ConversacionResumen[]> {
  return getJson<ConversacionResumen[]>(
    `${BASE}/mensajes/conversaciones`,
    token,
    []
  );
}

export function getSolicitudes(
  token: string
): Promise<ConversacionResumen[]> {
  return getJson<ConversacionResumen[]>(
    `${BASE}/mensajes/solicitudes`,
    token,
    []
  );
}

export async function getNoLeidos(token: string): Promise<number> {
  const data = await getJson<{ total: number }>(
    `${BASE}/mensajes/no-leidos`,
    token,
    { total: 0 }
  );
  return data.total ?? 0;
}

export function getHilo(
  token: string,
  convId: number,
  after?: number
): Promise<HiloRespuesta | null> {
  const qs = after && after > 0 ? `?after=${after}` : "";
  return getJson<HiloRespuesta | null>(
    `${BASE}/mensajes/conversaciones/${convId}${qs}`,
    token,
    null
  );
}

export function buscarUsuarios(
  token: string,
  q: string
): Promise<UsuarioPublico[]> {
  return getJson<UsuarioPublico[]>(
    `${BASE}/usuarios/buscar?q=${encodeURIComponent(q)}`,
    token,
    []
  );
}

// ─── Escrituras ────────────────────────────────────────────────────────────

export function abrirConversacion(
  token: string,
  destinatarioId: number
): Promise<Resultado<{ id: number; estado: string }>> {
  return postJson(`${BASE}/mensajes/conversaciones`, token, {
    destinatario_id: destinatarioId,
  });
}

export async function enviarMensaje(
  token: string,
  convId: number,
  cuerpo: string
): Promise<Resultado<{ mensaje: Mensaje; notificar: NotificarDatos | null }>> {
  const res = await postJson<Mensaje & { notificar?: NotificarDatos | null }>(
    `${BASE}/mensajes/conversaciones/${convId}/mensajes`,
    token,
    { cuerpo }
  );
  if (!res.ok) return res;
  const { notificar, ...mensaje } = res.data;
  return { ok: true, data: { mensaje: mensaje as Mensaje, notificar: notificar ?? null } };
}

export function marcarLeido(
  token: string,
  convId: number
): Promise<Resultado<{ ok: boolean }>> {
  return postJson(`${BASE}/mensajes/conversaciones/${convId}/leido`, token);
}

export function aceptarConversacion(
  token: string,
  convId: number
): Promise<Resultado<{ ok: boolean; estado: string }>> {
  return postJson(`${BASE}/mensajes/conversaciones/${convId}/aceptar`, token);
}

export function bloquearConversacion(
  token: string,
  convId: number,
  bloquear: boolean
): Promise<Resultado<{ ok: boolean; bloqueado: boolean }>> {
  return postJson(`${BASE}/mensajes/conversaciones/${convId}/bloquear`, token, {
    bloquear,
  });
}

export function reportarConversacion(
  token: string,
  convId: number,
  motivo?: string
): Promise<Resultado<{ ok: boolean }>> {
  return postJson(`${BASE}/mensajes/conversaciones/${convId}/reportar`, token, {
    motivo: motivo ?? "",
  });
}

// ─── Moderación (admin) ──────────────────────────────────────────────────────

export function getModeracionReportes(
  token: string
): Promise<ReporteModeracion[]> {
  return getJson<ReporteModeracion[]>(
    `${BASE}/mensajes/moderacion/reportes`,
    token,
    []
  );
}

export function suspenderUsuario(
  token: string,
  userId: number,
  suspender: boolean
): Promise<Resultado<{ ok: boolean; suspendido: boolean }>> {
  return postJson(`${BASE}/mensajes/moderacion/suspender`, token, {
    user_id: userId,
    suspender,
  });
}
