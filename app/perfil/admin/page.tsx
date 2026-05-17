import Link from "next/link";
import { redirect } from "next/navigation";
import { Activity, AlertTriangle, ArrowLeft, Globe, ServerCrash } from "lucide-react";
import { auth } from "@/lib/auth";
import { getTelemetrySummary } from "@/lib/admin-telemetry";

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString("es-UY", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  } catch {
    return value;
  }
}

export default async function PerfilAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/perfil/admin");
  }

  const roles = (session.user.roles ?? []).map((r) => r.toLowerCase());
  const isAdmin = roles.includes("administrator");

  if (!isAdmin) {
    redirect("/sin-acceso");
  }

  const summary = getTelemetrySummary();

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-400/90">Panel Admin</p>
          <h1 className="mt-1 text-3xl font-black text-foreground">Estadísticas y Errores</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Solo visible para administradores. Última actualización: {formatDate(summary.generatedAt)}
          </p>
        </div>

        <Link
          href="/perfil"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-amber-500/40 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi Cuenta
        </Link>
      </div>

      <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-100/85">
        Este panel usa almacenamiento en memoria del servidor. Es ideal para monitoreo operativo rápido, pero no persiste
        tras reinicios o nuevos deploys.
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 inline-flex rounded-lg bg-sky-500/10 p-2 text-sky-400">
            <Activity className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Visitas</p>
          <p className="mt-1 text-3xl font-black text-foreground">{summary.totals.visits}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 inline-flex rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
            <Globe className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Rutas Únicas</p>
          <p className="mt-1 text-3xl font-black text-foreground">{summary.totals.uniquePaths}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 inline-flex rounded-lg bg-orange-500/10 p-2 text-orange-400">
            <ServerCrash className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Errores Server</p>
          <p className="mt-1 text-3xl font-black text-foreground">{summary.totals.serverErrors}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-2 inline-flex rounded-lg bg-rose-500/10 p-2 text-rose-400">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Errores Browser</p>
          <p className="mt-1 text-3xl font-black text-foreground">{summary.totals.browserErrors}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">Top rutas visitadas</h2>
          {summary.topPaths.length === 0 ? (
            <p className="text-sm text-muted-foreground">Sin visitas registradas todavía.</p>
          ) : (
            <div className="space-y-2">
              {summary.topPaths.slice(0, 12).map((item) => (
                <div
                  key={item.path}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-muted/20 px-3 py-2"
                >
                  <span className="truncate text-sm text-foreground">{item.path}</span>
                  <span className="ml-3 rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-lg font-bold text-foreground">Log de errores recientes</h2>
          {summary.recentErrors.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay errores registrados.</p>
          ) : (
            <div className="space-y-3">
              {summary.recentErrors.slice(0, 12).map((err) => (
                <div key={err.id} className="rounded-lg border border-border/70 bg-muted/20 p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                        err.source === "server"
                          ? "bg-orange-500/15 text-orange-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {err.source}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{formatDate(err.at)}</span>
                  </div>

                  <p className="line-clamp-2 text-sm font-medium text-foreground">{err.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {err.path || "sin ruta"}
                    {err.userEmail ? ` · ${err.userEmail}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
