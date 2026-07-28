"use client";

import { useEffect, useState } from "react";
import { AgeGate, AGE_GATE_COOKIE } from "@/components/AgeGate";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { getCookie } from "@/lib/client-cookies";
import { reapplyStoredConsent } from "@/lib/consent";

export function ConsentGates() {
  const [ageConfirmed, setAgeConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    setAgeConfirmed(Boolean(getCookie(AGE_GATE_COOKIE)));
    reapplyStoredConsent();
  }, []);

  return (
    <>
      <AgeGate confirmed={ageConfirmed} onConfirm={() => setAgeConfirmed(true)} />
      {ageConfirmed && <CookieConsentBanner />}
    </>
  );
}
