"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Spade, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

function ConfirmarForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = searchParams.get("login") ?? "";
  const key = searchParams.get("key") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [listo, setListo] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const enlaceInvalido = !login || !key;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setFormError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/recuperar-password/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key, password_nueva: password }),
      });
      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setFormError(data.error ?? "No se pudo restablecer la contraseña.");
        setLoading(false);
        return;
      }

      setListo(true);
      setTimeout(() => router.push("/login?reset=1"), 2500);
    } catch {
      setFormError("Error de red. Probá nuevamente en unos segundos.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-black text-2xl">
            <Spade className="h-5 w-5 text-amber-400" />
            <span className="text-foreground">ATR</span>
            <span className="text-amber-400">Poker</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Elegí tu nueva contraseña</p>
        </div>

        <Card>
          {enlaceInvalido ? (
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <p className="font-semibold text-foreground">Enlace inválido</p>
              <p className="text-sm text-muted-foreground">
                Este enlace no es válido. Pedí uno nuevo para continuar.
              </p>
              <Button asChild className="mt-2 w-full">
                <Link href="/recuperar-contrasena">Solicitar enlace nuevo</Link>
              </Button>
            </CardContent>
          ) : listo ? (
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Contraseña actualizada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ya podés iniciar sesión con tu contraseña nueva. Te
                  redirigimos automáticamente...
                </p>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Nueva contraseña</CardTitle>
                <CardDescription>
                  Elegí una contraseña nueva para tu cuenta de ATRPoker.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {formError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      Contraseña nueva
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-foreground"
                    >
                      Repetir contraseña
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar contraseña"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function ConfirmarRecuperacionPage() {
  return (
    <Suspense>
      <ConfirmarForm />
    </Suspense>
  );
}
