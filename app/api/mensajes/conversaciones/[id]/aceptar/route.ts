import { requireWpToken } from "@/lib/api-auth";
import { aceptarConversacion } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/conversaciones/[id]/aceptar — aceptar una solicitud
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const convId = Number(id);
  if (!Number.isInteger(convId) || convId <= 0) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const resultado = await aceptarConversacion(auth.token, convId);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
