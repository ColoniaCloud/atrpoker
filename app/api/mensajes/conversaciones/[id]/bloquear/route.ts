import { requireWpToken } from "@/lib/api-auth";
import { bloquearConversacion } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/conversaciones/[id]/bloquear — bloquear/desbloquear
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

  let bloquear = true;
  try {
    const body = (await req.json()) as { bloquear?: unknown };
    if (typeof body?.bloquear === "boolean") bloquear = body.bloquear;
  } catch {
    // sin body → bloquear por defecto
  }

  const resultado = await bloquearConversacion(auth.token, convId, bloquear);
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
