import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTelemetrySummary } from "@/lib/admin-telemetry";

export async function GET() {
  const session = await auth();
  const roles = (session?.user?.roles ?? []).map((r) => r.toLowerCase());
  const isAdmin = roles.includes("administrator");

  if (!session?.user || !isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  return NextResponse.json(getTelemetrySummary());
}
