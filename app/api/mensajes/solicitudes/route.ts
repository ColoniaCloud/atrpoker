import { requireWpToken } from "@/lib/api-auth";
import { getSolicitudes } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/mensajes/solicitudes — conversaciones pendientes recibidas
export async function GET() {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const solicitudes = await getSolicitudes(auth.token);
  return NextResponse.json(solicitudes);
}
