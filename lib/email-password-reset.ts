import "server-only";
import { Resend } from "resend";
import type { DatosEnvioReset } from "@/lib/password-reset";

// Email de recuperación de contraseña, enviado desde el servidor con Resend
// para mantener el diseño de marca (en vez del wp_mail por defecto de WP).

export async function enviarEmailResetPassword(
  datos: DatosEnvioReset
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  const appUrl = process.env.NEXTAUTH_URL ?? "https://atrpoker.com";
  const link = `${appUrl}/recuperar-contrasena/confirmar?login=${encodeURIComponent(
    datos.login
  )}&key=${encodeURIComponent(datos.key)}`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#18181b;border-radius:12px 12px 0 0;padding:24px 28px;border-bottom:2px solid #f59e0b">
        <img src="https://atrpoker.com/wp-content/uploads/Isologotipo.webp" alt="ATRPoker" height="28" style="height:28px"/>
        <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;letter-spacing:.08em;text-transform:uppercase">
          Recuperar contraseña
        </p>
      </div>
      <div style="background:#fafafa;padding:28px;border-radius:0 0 12px 12px">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Hola ${datos.nombre}, recibimos una solicitud para restablecer tu contraseña de ATRPoker.
        </p>
        <a href="${link}" style="display:inline-block;background:#f59e0b;color:#18181b;font-weight:700;text-decoration:none;border-radius:8px;padding:12px 22px;font-size:14px">
          Elegir nueva contraseña
        </a>
        <p style="font-size:12px;color:#71717a;margin:20px 0 0">
          Si no pediste este cambio, ignorá este email — tu contraseña actual sigue funcionando.
          Este enlace expira en 24 horas.
        </p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "ATRPoker <onboarding@resend.dev>",
      to: datos.email,
      subject: "Recuperar tu contraseña de ATRPoker",
      html,
    });
  } catch (err) {
    console.error("Resend (reset password) error:", err);
  }
}
