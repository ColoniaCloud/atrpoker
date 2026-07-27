import { NextResponse } from "next/server";
import { confirmarResetPassword } from "@/lib/password-reset";

export const runtime = "nodejs";

// POST /api/recuperar-password/confirmar — valida la key y setea la nueva
// contraseña. A diferencia de la solicitud, acá sí se puede devolver el
// error real: quien llama ya tiene la key (vino del email), no es
// enumeración de cuentas.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { login, key, password_nueva: passwordNueva } =
    (body ?? {}) as Record<string, unknown>;

  if (
    typeof login !== "string" ||
    typeof key !== "string" ||
    typeof passwordNueva !== "string" ||
    login.trim() === "" ||
    key.trim() === "" ||
    passwordNueva.length < 8
  ) {
    return NextResponse.json(
      { error: "Completá el formulario con una contraseña de 8+ caracteres." },
      { status: 400 }
    );
  }

  const resultado = await confirmarResetPassword(login, key, passwordNueva);
  if (!resultado.ok) {
    return NextResponse.json(
      { error: resultado.error },
      { status: resultado.status }
    );
  }

  return NextResponse.json({ ok: true });
}
