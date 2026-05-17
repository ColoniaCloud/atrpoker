"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function sendTelemetry(url: string, payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignorado: la telemetría no debe romper la UX del usuario.
  });
}

export function TelemetryTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = {
      path: pathname || "/",
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
    };

    sendTelemetry("/api/admin/telemetry/visit", payload);
  }, [pathname]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      sendTelemetry("/api/admin/telemetry/browser-error", {
        message: event.message || "window.onerror",
        stack: event.error?.stack,
        path: pathname || window.location.pathname,
        userAgent: navigator.userAgent,
        extra: event.filename
          ? `${event.filename}:${event.lineno}:${event.colno}`
          : undefined,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      sendTelemetry("/api/admin/telemetry/browser-error", {
        message:
          reason instanceof Error
            ? reason.message
            : typeof reason === "string"
              ? reason
              : "Unhandled promise rejection",
        stack: reason instanceof Error ? reason.stack : undefined,
        path: pathname || window.location.pathname,
        userAgent: navigator.userAgent,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [pathname]);

  return null;
}
