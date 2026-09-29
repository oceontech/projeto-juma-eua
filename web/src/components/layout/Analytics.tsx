import Script from "next/script";

/**
 * Umami, o mesmo do site BR (juma-stats.vercel.app). Sem cookies. Só carrega
 * com as variáveis de ambiente definidas; `data-domains` ignora previews.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!src || !id) return null;
  return (
    <Script
      src={src}
      data-website-id={id}
      data-domains={process.env.NEXT_PUBLIC_UMAMI_DOMAINS || undefined}
      strategy="afterInteractive"
    />
  );
}

type Umami = { track: (event: string, data?: Record<string, string>) => void };

/** Evento no Umami; não faz nada se o script não carregou. */
export function track(event: string, data?: Record<string, string | undefined>) {
  const umami = (window as unknown as { umami?: Umami }).umami;
  if (!umami) return;
  const clean = Object.fromEntries(
    Object.entries(data ?? {}).filter(([, v]) => v),
  ) as Record<string, string>;
  try {
    umami.track(event, clean);
  } catch {
    /* Métrica nunca derruba a página. */
  }
}
