import "server-only";
import { Resend } from "resend";
import type { NotificarDatos } from "@/lib/types";

// Aviso por email de "mensaje nuevo", enviado desde el servidor con Resend.
// El endpoint de WP ya decidió que corresponde notificar (hilo aceptado +
// receptor inactivo + throttle). Acá solo se arma y envía el correo.

export async function enviarAvisoMensaje(datos: NotificarDatos): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;

  const resend = new Resend(key);
  const appUrl = process.env.NEXTAUTH_URL ?? "https://atrpoker.com";
  const link = `${appUrl}/perfil/mensajes`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#18181b;border-radius:12px 12px 0 0;padding:24px 28px;border-bottom:2px solid #f59e0b">
        <img src="https://atrpoker.com/wp-content/uploads/Isologotipo.webp" alt="ATRPoker" height="28" style="height:28px"/>
        <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;letter-spacing:.08em;text-transform:uppercase">
          Nuevo mensaje
        </p>
      </div>
      <div style="background:#fafafa;padding:28px;border-radius:0 0 12px 12px">
        <p style="font-size:15px;line-height:1.6;margin:0 0 16px">
          Hola ${datos.nombre}, <strong>${datos.de}</strong> te envió un mensaje en ATRPoker.
        </p>
        <a href="${link}" style="display:inline-block;background:#f59e0b;color:#18181b;font-weight:700;text-decoration:none;border-radius:8px;padding:12px 22px;font-size:14px">
          Ver mensaje
        </a>
        <p style="font-size:12px;color:#71717a;margin:20px 0 0">
          Si no querés recibir estos avisos, podés desactivar los mensajes desde tu perfil.
        </p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "ATRPoker <onboarding@resend.dev>",
      to: datos.email,
      subject: `${datos.de} te envió un mensaje`,
      html,
    });
  } catch (err) {
    // No romper el envío del mensaje por un fallo de email.
    console.error("Resend (aviso mensaje) error:", err);
  }
}
