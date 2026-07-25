import { requireWpToken } from "@/lib/api-auth";
import { getNoLeidos } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/mensajes/no-leidos — total de mensajes no leídos (badge navbar)
export async function GET() {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const total = await getNoLeidos(auth.token);
  return NextResponse.json({ total });
}
