import { requireAdmin } from "@/lib/api-auth";
import { suspenderUsuario } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// POST /api/mensajes/moderacion/suspender — suspender/reactivar (solo admin)
export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const userId = (body as { user_id?: unknown })?.user_id;
  const suspender = (body as { suspender?: unknown })?.suspender;
  if (typeof userId !== "number" || !Number.isInteger(userId)) {
    return NextResponse.json(
      { error: "Se requiere user_id (número)" },
      { status: 400 }
    );
  }

  const resultado = await suspenderUsuario(
    auth.token,
    userId,
    typeof suspender === "boolean" ? suspender : true
  );
  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }
  return NextResponse.json(resultado.data);
}
