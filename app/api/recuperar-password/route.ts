import { NextResponse } from "next/server";
import { solicitarResetPassword } from "@/lib/password-reset";
import { enviarEmailResetPassword } from "@/lib/email-password-reset";

export const runtime = "nodejs";

// POST /api/recuperar-password — pide el reset y dispara el email.
// Responde SIEMPRE éxito genérico (exista o no la cuenta) para no filtrar
// qué usuarios/emails están registrados.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const identificador = (body as { identificador?: unknown })?.identificador;
  if (typeof identificador !== "string" || identificador.trim().length < 3) {
    return NextResponse.json(
      { error: "Ingresá tu usuario o email." },
      { status: 400 }
    );
  }

  const datos = await solicitarResetPassword(identificador.trim());
  if (datos) {
    await enviarEmailResetPassword(datos);
  }

  return NextResponse.json({ ok: true });
}
