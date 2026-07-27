// ─── Capa de acceso a datos: recuperación de contraseña ─────────────────────
// Requiere endpoints custom en WordPress:
//   POST /wp-json/atrpoker/v1/recuperar-password
//   POST /wp-json/atrpoker/v1/restablecer-password
// Ver: /documentos/register-recuperar-password-endpoint.php (ignorado por git)
//
// El WP endpoint nunca expone la key de reseteo al browser: la devuelve acá
// (server-to-server) para que el route handler dispare el email con Resend.

const WP_URL = process.env.WORDPRESS_URL || "https://atr.academy";
const BASE = `${WP_URL}/wp-json/atrpoker/v1`;

export interface DatosEnvioReset {
  email: string;
  nombre: string;
  login: string;
  key: string;
}

/**
 * Pide a WP que genere la key de reseteo. Devuelve los datos para el email
 * SOLO si la cuenta existe — nunca lanza ni revela si existe o no al caller
 * (el route handler siempre responde éxito genérico al cliente).
 */
export async function solicitarResetPassword(
  identificador: string
): Promise<DatosEnvioReset | null> {
  try {
    const res = await fetch(`${BASE}/recuperar-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identificador }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { enviar?: DatosEnvioReset | null };
    return data.enviar ?? null;
  } catch {
    return null;
  }
}

export type ResultadoConfirmar =
  | { ok: true }
  | { ok: false; status: number; error: string };

/** Valida la key y setea la contraseña nueva en WordPress. */
export async function confirmarResetPassword(
  login: string,
  key: string,
  passwordNueva: string
): Promise<ResultadoConfirmar> {
  try {
    const res = await fetch(`${BASE}/restablecer-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, key, password_nueva: passwordNueva }),
      cache: "no-store",
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const error =
        (data as { message?: string } | null)?.message ??
        "No se pudo restablecer la contraseña";
      return { ok: false, status: res.status, error };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 500, error: "Error de red" };
  }
}
