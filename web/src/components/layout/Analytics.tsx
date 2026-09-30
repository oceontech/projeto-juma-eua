import { Tracker } from "./Tracker";

/**
 * Umami, o mesmo do site BR (juma-stats.vercel.app). Sem cookies. Só carrega
 * com as variáveis de ambiente definidas; `data-domains` ignora previews.
 */
export function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const id = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  if (!src || !id) return null;
  return <Tracker src={src} id={id} domains={process.env.NEXT_PUBLIC_UMAMI_DOMAINS} />;
}

/** Mantido aqui por compatibilidade: quem importava `track` daqui continua funcionando. */
export { track } from "./track";
