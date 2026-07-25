import { requireWpToken } from "@/lib/api-auth";
import { marcarLeido } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/conversaciones/[id]/leido — marcar hilo como leído
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

  const resultado = await marcarLeido(auth.token, convId);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
