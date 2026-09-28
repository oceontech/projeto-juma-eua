"use client";

import { useEffect } from "react";

/**
 * Guarda a origem da visita (UTM, gclid, fbclid, referrer externo) em dois
 * cookies próprios de 90 dias: primeiro e último toque. O pedido de trial
 * envia os dois ao painel, que mostra de qual campanha veio cada lead.
 * Mesmo formato do site BR (src/features/leads/touch.ts).
 */
const FIRST = "juma_first";
const LAST = "juma_last";
const MAX_AGE = 60 * 60 * 24 * 90;
const PARAMS: Record<string, string> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_term: "term",
  utm_content: "content",
  gclid: "gclid",
  fbclid: "fbclid",
};

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax`;
}

export function TouchCapture() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const touch: Record<string, string> = {};
    for (const [param, key] of Object.entries(PARAMS)) {
      const value = url.searchParams.get(param);
      if (value) touch[key] = value.slice(0, 200);
    }
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer);
        if (ref.hostname !== url.hostname) touch.referrer = ref.hostname;
      }
    } catch {}
    if (!Object.keys(touch).length) return;
    touch.landing = url.pathname;
    touch.at = new Date().toISOString();
    const value = JSON.stringify(touch);
    if (!document.cookie.includes(`${FIRST}=`)) setCookie(FIRST, value);
    setCookie(LAST, value);
  }, []);
  return null;
}
