import { requireWpToken } from "@/lib/api-auth";
import { buscarUsuarios } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/usuarios/buscar?q= — directorio mínimo para iniciar conversaciones
export async function GET(req: Request) {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const usuarios = await buscarUsuarios(auth.token, q);
  return NextResponse.json(usuarios);
}
