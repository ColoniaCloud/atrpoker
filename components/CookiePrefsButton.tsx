"use client";

import { OPEN_COOKIE_PREFS_EVENT } from "@/lib/consent";

export function CookiePrefsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_PREFS_EVENT))}
      className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Preferencias de cookies
    </button>
  );
}
