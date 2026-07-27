"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Spade, MailCheck } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

export default function RecuperarContrasenaPage() {
  const [identificador, setIdentificador] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (identificador.trim().length < 3) {
      setFormError("Ingresá tu usuario o email.");
      return;
    }

    setFormError(null);
    setLoading(true);
    try {
      await fetch("/api/recuperar-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificador: identificador.trim() }),
      });
      // Siempre mostramos éxito: el backend nunca revela si la cuenta existe.
      setEnviado(true);
    } catch {
      setFormError("Error de red. Probá nuevamente en unos segundos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 font-black text-2xl">
            <Spade className="h-5 w-5 text-amber-400" />
            <span className="text-foreground">ATR</span>
            <span className="text-amber-400">Poker</span>
          </Link>
          <p className="mt-2 text-muted-foreground">Recuperá el acceso a tu cuenta</p>
        </div>

        <Card>
          {enviado ? (
            <CardContent className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <MailCheck className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Revisá tu email</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Si la cuenta existe, te enviamos un enlace para elegir una
                  contraseña nueva. Puede tardar unos minutos en llegar.
                </p>
              </div>
              <Button asChild variant="outline" className="mt-2 w-full">
                <Link href="/login">Volver a iniciar sesión</Link>
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Recuperar contraseña</CardTitle>
                <CardDescription>
                  Ingresá tu usuario o email y te mandamos un enlace para
                  elegir una contraseña nueva.
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
                    <label
                      htmlFor="identificador"
                      className="text-sm font-medium text-foreground"
                    >
                      Usuario o email
                    </label>
                    <Input
                      id="identificador"
                      type="text"
                      value={identificador}
                      onChange={(e) => setIdentificador(e.target.value)}
                      required
                      autoComplete="username"
                      placeholder="tu_usuario o tu@email.com"
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar enlace de recuperación"
                    )}
                  </Button>
                </form>
              </CardContent>
            </>
          )}
        </Card>

        <Separator />

        <p className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline font-medium">
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
