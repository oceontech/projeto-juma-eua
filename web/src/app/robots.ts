import type { MetadataRoute } from "next";

/**
 * O site não vai ao ar antes da liberação do responsável regulatório da LLC.
 * Até lá, tudo bloqueado — a mesma política do vercel.json do protótipo.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
