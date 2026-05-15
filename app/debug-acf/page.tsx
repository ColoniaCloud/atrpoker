// RUTA DE DEBUG TEMPORAL — eliminá este archivo cuando confirmes que ACF funciona.
// Accedé a: http://localhost:3000/debug-acf?slug=TU-POST-SLUG

import { notFound } from "next/navigation";

const WP_URL = process.env.WORDPRESS_URL || "https://atr.academy";

interface PageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function DebugAcfPage({ searchParams }: PageProps) {
  const { slug } = await searchParams;

  if (!slug) {
    return (
      <div className="p-8 font-mono text-sm">
        <p className="text-muted-foreground">
          Pasá el slug del post como query param:
          <br />
          <code className="bg-muted px-1 rounded">
            http://localhost:3000/debug-acf?slug=SLUG-DEL-POST
          </code>
        </p>
      </div>
    );
  }

  const res = await fetch(
    `${WP_URL}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1&status=publish`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <p className="p-8 text-red-500">Error al conectar con WordPress: {res.status}</p>;
  }

  const posts = await res.json();
  const post = posts[0];

  if (!post) {
    return <p className="p-8 text-red-500">Post &quot;{slug}&quot; no encontrado.</p>;
  }

  const acf = post.acf;

  return (
    <div className="p-8 font-mono text-xs space-y-6 max-w-3xl">
      <h1 className="text-xl font-bold font-sans">Debug ACF — {slug}</h1>

      {/* Estado de ACF */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold font-sans">Estado de campos ACF</h2>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted text-xs">
              <th className="border border-border px-3 py-2">Campo</th>
              <th className="border border-border px-3 py-2">Valor recibido</th>
              <th className="border border-border px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {[
              "bunny_video_id",
              "bunny_library_id",
              "duracion_del_video",
              "required_role",
              "is_live",
            ].map((field) => {
              const value = acf?.[field];
              const status = !acf
                ? "❌ acf es undefined (REST API desactivado)"
                : value === undefined
                ? "⚠️  Campo no encontrado en respuesta"
                : value === "" || value === null
                ? "⚠️  Campo vacío (sin valor en el post)"
                : "✅ OK";

              return (
                <tr key={field} className="border-b border-border">
                  <td className="border border-border px-3 py-2 text-primary">{field}</td>
                  <td className="border border-border px-3 py-2 text-foreground/70">
                    {value !== undefined && value !== null ? String(value) : "—"}
                  </td>
                  <td className="border border-border px-3 py-2">{status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Diagnóstico */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold font-sans">Diagnóstico</h2>
        <div className="rounded-md border border-border bg-muted/50 p-4 space-y-2">
          {!acf && (
            <p className="text-red-500">
              ❌ <strong>La clave &quot;acf&quot; no existe en la respuesta.</strong>
              <br />
              Solución: ACF → Field Groups → tu grupo → Edit → Settings →{" "}
              <strong>Show in REST API = Yes</strong>
            </p>
          )}
          {acf && !acf.bunny_video_id && (
            <p className="text-yellow-600">
              ⚠️ <strong>bunny_video_id</strong> está vacío o no existe.
              <br />
              Verificá que el campo tenga valor cargado en este post y que el nombre del campo
              en ACF sea exactamente <code>bunny_video_id</code>.
            </p>
          )}
          {acf && !acf.duracion_del_video && (
            <p className="text-yellow-600">
              ⚠️ <strong>duracion_del_video</strong> está vacío o no existe.
              <br />
              Verificá que el campo tenga valor cargado en este post y que el nombre sea
              exactamente <code>duracion_del_video</code>.
            </p>
          )}
          {acf && acf.bunny_video_id && acf.duracion_del_video && (
            <p className="text-green-600">
              ✅ Los campos ACF están correctamente configurados y tienen valores.
              <br />
              Si el video sigue sin verse, revisá que el Video ID sea válido en Bunny Stream.
            </p>
          )}
        </div>
      </section>

      {/* JSON completo del acf */}
      <section className="space-y-2">
        <h2 className="text-base font-semibold font-sans">acf completo (raw)</h2>
        <pre className="rounded-md border border-border bg-muted/50 p-4 overflow-auto text-xs">
          {JSON.stringify(acf ?? "undefined", null, 2)}
        </pre>
      </section>
    </div>
  );
}
