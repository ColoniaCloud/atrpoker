import { requireAdmin } from "@/lib/api-auth";
import { getModeracionReportes } from "@/lib/mensajes";
import { NextResponse } from "next/server";

// GET /api/mensajes/moderacion — usuarios reportados (solo admin)
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const reportes = await getModeracionReportes(auth.token);
  return NextResponse.json(reportes);
}
