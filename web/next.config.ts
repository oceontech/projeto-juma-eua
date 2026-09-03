import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * O site não vai ao ar antes da liberação do responsável regulatório da
   * LLC — a mesma política do protótipo em site/vercel.json. O cabeçalho
   * cobre o que o robots.txt não cobre: o que já foi rastreado.
   *
   * Quando a liberação sair, apague este bloco e o `robots` do metadata em
   * src/app/layout.tsx, e ajuste src/app/robots.ts.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
