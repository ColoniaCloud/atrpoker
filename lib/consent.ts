import { getCookie, setCookie } from "./client-cookies";

// Cuando se agregue GA4 / Google Ads: el snippet oficial puede cargarse tal cual (via next/script,
// strategy="afterInteractive") — este modulo ya deja seteado el estado "denied" por defecto
// (ver Script "consent-mode-default" en app/layout.tsx) y actualiza el dataLayer/gtag existente,
// asi que el consentimiento ya guardado se respeta desde el primer tag sin tocar nada mas aca.
//
// Cuando se agregue el Pixel de Meta: no inicializar fbq() hasta que hasMarketingConsent() === true,
// y escuchar CONSENT_CHANGE_EVENT para inicializarlo si el usuario acepta despues. Si el pixel ya
// esta cargado, usar fbq('consent', 'revoke'|'grant') segun corresponda.

export const CONSENT_COOKIE = "atrpoker_consent";
export const CONSENT_CHANGE_EVENT = "atrpoker:consent-change";
export const OPEN_COOKIE_PREFS_EVENT = "atrpoker:open-cookie-prefs";

const CONSENT_DAYS = 365;

export interface ConsentPrefs {
  analytics: boolean;
  marketing: boolean;
}

export type ConsentState = ConsentPrefs & { ts: string };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushConsentUpdate(prefs: ConsentPrefs): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };

  window.gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  });
}

export function getConsent(): ConsentState | null {
  const raw = getCookie(CONSENT_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function saveConsent(prefs: ConsentPrefs): void {
  const state: ConsentState = { ...prefs, ts: new Date().toISOString() };
  setCookie(CONSENT_COOKIE, JSON.stringify(state), CONSENT_DAYS);
  pushConsentUpdate(prefs);
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: state }));
}

// Reafirma en el dataLayer el consentimiento ya guardado (visitas siguientes, antes de que
// el usuario vuelva a interactuar con el banner).
export function reapplyStoredConsent(): void {
  const stored = getConsent();
  if (stored) pushConsentUpdate(stored);
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  return getConsent()?.marketing ?? false;
}
