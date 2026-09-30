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
