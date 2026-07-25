import { requireWpToken } from "@/lib/api-auth";
import { reportarConversacion } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/conversaciones/[id]/reportar — reportar al otro usuario
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

  let motivo = "";
  try {
    const body = (await req.json()) as { motivo?: unknown };
    if (typeof body?.motivo === "string") motivo = body.motivo;
  } catch {
    // sin body → reporte sin motivo
  }

  const resultado = await reportarConversacion(auth.token, convId, motivo);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
