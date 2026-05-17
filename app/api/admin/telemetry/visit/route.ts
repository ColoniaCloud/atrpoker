import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordVisit, recordServerError } from "@/lib/admin-telemetry";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    const path = typeof body?.path === "string" ? body.path : "/";
    const referrer = typeof body?.referrer === "string" ? body.referrer : undefined;

    recordVisit({
      path,
      referrer,
      userName: session?.user?.name ?? undefined,
      userEmail: session?.user?.email ?? undefined,
      roles: session?.user?.roles ?? [],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    recordServerError({
      message: "Error registrando visita",
      stack: error instanceof Error ? error.stack : undefined,
      path: "/api/admin/telemetry/visit",
      extra: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
