import { requireWpToken } from "@/lib/api-auth";
import { getConversaciones, abrirConversacion } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/mensajes/conversaciones — bandeja de conversaciones aceptadas
export async function GET() {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const conversaciones = await getConversaciones(auth.token);
  return NextResponse.json(conversaciones);
}

// POST /api/mensajes/conversaciones — abrir o recuperar un DM
export async function POST(req: Request) {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const destinatarioId = (body as { destinatario_id?: unknown })?.destinatario_id;
  if (typeof destinatarioId !== "number" || !Number.isInteger(destinatarioId)) {
    return NextResponse.json(
      { error: "Se requiere destinatario_id (número)" },
      { status: 400 }
    );
  }

  const resultado = await abrirConversacion(auth.token, destinatarioId);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
