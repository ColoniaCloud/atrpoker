import { requireWpToken } from "@/lib/api-auth";
import { getProgreso, saveProgreso } from "@/lib/wordpress";
import { NextResponse } from "next/server";

// GET /api/progreso — devuelve el progreso del usuario autenticado
export async function GET() {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  const progreso = await getProgreso(auth.token);
  return NextResponse.json(progreso);
}

// POST /api/progreso — guarda el estado de un video
export async function POST(req: Request) {
  const auth = await requireWpToken();
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).slug !== "string" ||
    typeof (body as Record<string, unknown>).completed !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Se requieren slug (string) y completed (boolean)" },
      { status: 400 }
    );
  }

  const { slug, completed } = body as { slug: string; completed: boolean };
  const ok = await saveProgreso(auth.token, slug, completed);

  if (!ok) {
    // El endpoint de WordPress todavía no está disponible — fallback OK
    // para que el cliente pueda seguir usando localStorage
    return NextResponse.json({ ok: false, fallback: true });
  }

  return NextResponse.json({ ok: true });
}
