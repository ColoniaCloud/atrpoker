import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordBrowserError, recordServerError } from "@/lib/admin-telemetry";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json().catch(() => ({}));

    const message = typeof body?.message === "string" ? body.message : "Error de navegador";
    const stack = typeof body?.stack === "string" ? body.stack : undefined;
    const path = typeof body?.path === "string" ? body.path : "/";
    const userAgent = typeof body?.userAgent === "string" ? body.userAgent : undefined;
    const extra = typeof body?.extra === "string" ? body.extra : undefined;

    recordBrowserError({
      message,
      stack,
      path,
      userAgent,
      extra,
      userName: session?.user?.name ?? undefined,
      userEmail: session?.user?.email ?? undefined,
      roles: session?.user?.roles ?? [],
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    recordServerError({
      message: "Error registrando browser error",
      stack: error instanceof Error ? error.stack : undefined,
      path: "/api/admin/telemetry/browser-error",
      extra: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
