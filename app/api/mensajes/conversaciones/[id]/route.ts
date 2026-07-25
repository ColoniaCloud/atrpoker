import { requireWpToken } from "@/lib/api-auth";
import { getHilo } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/mensajes/conversaciones/[id]?after=N — mensajes del hilo
export async function GET(
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

  const after = Number(new URL(req.url).searchParams.get("after") ?? 0);
  const hilo = await getHilo(auth.token, convId, after > 0 ? after : undefined);
  if (!hilo) {
    return NextResponse.json({ error: "No disponible" }, { status: 404 });
  }
  return NextResponse.json(hilo);
}
