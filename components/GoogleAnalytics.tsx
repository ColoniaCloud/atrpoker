import Script from "next/script";

// No-op mientras NEXT_PUBLIC_GA_MEASUREMENT_ID no este seteado. El script de
// Consent Mode v2 en app/layout.tsx ya corre "consent default denied" antes que
// esto, y lib/consent.ts llama gtag('consent','update',...) cuando el usuario
// acepta cookies de analitica — GA4 respeta ese consentimiento desde el primer
// pageview sin cablear nada mas aca.
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ window.dataLayer.push(arguments); }
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
