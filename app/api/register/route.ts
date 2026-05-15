import { NextResponse } from "next/server";
import { wpRegister } from "@/lib/wordpress";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido." },
      { status: 400 }
    );
  }

  const { username, email, password, name } =
    (body ?? {}) as Record<string, unknown>;

  // Validación liviana en el edge antes de tocar WP
  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    username.trim().length < 3 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8
  ) {
    return NextResponse.json(
      {
        error:
          "Completá usuario (3+ caracteres), email válido y contraseña (8+ caracteres).",
      },
      { status: 400 }
    );
  }

  const result = await wpRegister({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
    name: typeof name === "string" ? name.trim() : undefined,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error.message, code: result.error.code },
      { status: result.error.status || 400 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      user_id: result.data.user_id,
      // No exponemos el token al cliente: el frontend hace signIn con
      // username/password después del registro exitoso.
    },
    { status: 201 }
  );
}
