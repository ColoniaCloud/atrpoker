import { NextResponse } from "next/server";
import { Resend } from "resend";
import { auth } from "@/lib/auth";

const TIPO_LABELS: Record<string, string> = {
  sala:      "Elección de sala",
  deposito:  "Depósito",
  retiro:    "Retiro",
  rakeback:  "Rakeback",
  otro:      "Otro",
};

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { tipo, asunto, mensaje } = body as {
    tipo: string;
    asunto: string;
    mensaje: string;
  };

  if (!tipo || !asunto || !mensaje) {
    return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });
  }

  const tipoLabel = TIPO_LABELS[tipo] ?? tipo;
  const userName  = session.user.name  ?? "—";
  const userEmail = session.user.email ?? "—";
  const to        = process.env.SUPPORT_EMAIL ?? "soporte@atrpoker.com";

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#18181b;border-radius:12px 12px 0 0;padding:24px 28px;border-bottom:2px solid #f59e0b">
        <img src="https://atrpoker.com/wp-content/uploads/Isologotipo.webp" alt="ATRPoker" height="28" style="height:28px"/>
        <p style="margin:8px 0 0;font-size:12px;color:#a1a1aa;letter-spacing:.08em;text-transform:uppercase">
          Ticket de soporte
        </p>
      </div>
      <div style="background:#fafafa;padding:28px;border-radius:0 0 12px 12px">
        <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
          <tr><td style="padding:6px 0;color:#71717a;width:110px">Usuario</td><td style="padding:6px 0;font-weight:600">${userName}</td></tr>
          <tr><td style="padding:6px 0;color:#71717a">Email</td><td style="padding:6px 0">${userEmail}</td></tr>
          <tr><td style="padding:6px 0;color:#71717a">Tipo</td><td style="padding:6px 0"><span style="background:#fef3c7;color:#92400e;border-radius:99px;padding:2px 10px;font-size:12px;font-weight:600">${tipoLabel}</span></td></tr>
          <tr><td style="padding:6px 0;color:#71717a">Asunto</td><td style="padding:6px 0;font-weight:600">${asunto}</td></tr>
        </table>
        <div style="background:#fff;border:1px solid #e4e4e7;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;white-space:pre-wrap">${mensaje}</div>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: "ATRPoker Soporte <onboarding@resend.dev>",
      to,
      replyTo: userEmail !== "—" ? userEmail : undefined,
      subject: `[Soporte · ${tipoLabel}] ${asunto}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Error al enviar el ticket" }, { status: 500 });
  }
}
