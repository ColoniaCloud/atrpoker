import { requireWpToken } from "@/lib/api-auth";
import { enviarMensaje } from "@/lib/mensajes";
import { enviarAvisoMensaje } from "@/lib/email-mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/conversaciones/[id]/mensajes — enviar mensaje
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const convId = Number(id);
  if (!Number.isInteger(convId) || convId <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const cuerpo = (body as { cuerpo?: unknown })?.cuerpo;
  if (typeof cuerpo !== "string" || cuerpo.trim() === "") {
    return NextResponse.json(
      { error: "El mensaje no puede estar vacío" },
      { status: 400 }
    );
  }

  const resultado = await enviarMensaje(auth.token, convId, cuerpo);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }

  // Aviso por email server-side; los datos del destinatario NO se devuelven
  // al cliente (solo se retorna el mensaje).
  const { mensaje, notificar } = resultado.data;
  if (notificar) {
    await enviarAvisoMensaje(notificar);
  }

  return NextResponse.json(mensaje);
}
