"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getConsent,
  saveConsent,
  OPEN_COOKIE_PREFS_EVENT,
  type ConsentPrefs,
} from "@/lib/consent";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>({ analytics: false, marketing: false });

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  useEffect(() => {
    function reopen() {
      const existing = getConsent();
      if (existing) setPrefs({ analytics: existing.analytics, marketing: existing.marketing });
      setExpanded(true);
      setVisible(true);
    }
    window.addEventListener(OPEN_COOKIE_PREFS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_PREFS_EVENT, reopen);
  }, []);

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true });
    setVisible(false);
  }

  function rejectNonEssential() {
    saveConsent({ analytics: false, marketing: false });
    setVisible(false);
  }

  function saveCustom() {
    saveConsent(prefs);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-modal border-t border-border bg-background shadow-[0_-4px_24px_rgba(0,0,0,0.35)]">
      <div className="mx-auto w-[92vw] max-w-3xl py-4 sm:py-5">
        <p className="text-sm text-muted-foreground">
          Usamos cookies necesarias para el funcionamiento del sitio y, si lo permitís, cookies de
          análisis y de marketing (por ejemplo, para medir visitas o mostrar publicidad relevante).
          Podés cambiar tu elección cuando quieras desde &quot;Preferencias de cookies&quot; en el pie
          de página.
        </p>

        {expanded && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <span>
                Necesarias <span className="text-xs text-muted-foreground">(siempre activas)</span>
              </span>
              <input type="checkbox" checked disabled className="h-4 w-4 accent-amber-500" />
            </label>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm">
              <span>Análisis</span>
              <input
                type="checkbox"
                checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                className="h-4 w-4 accent-amber-500"
              />
            </label>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm sm:col-span-2">
              <span>Marketing</span>
              <input
                type="checkbox"
                checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                className="h-4 w-4 accent-amber-500"
              />
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={acceptAll}>
            Aceptar todo
          </Button>
          <Button size="sm" variant="outline" onClick={rejectNonEssential}>
            Rechazar no esenciales
          </Button>
          {!expanded ? (
            <Button size="sm" variant="ghost" onClick={() => setExpanded(true)}>
              Personalizar
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={saveCustom}>
              Guardar preferencias
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
