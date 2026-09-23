import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* 75 é o padrão; 90 fica para as fotos em tela cheia, que perdem
       detalhe visível com a compressão padrão. */
    qualities: [75, 90],
    /* O otimizador guarda cada variante por 4 horas e responde sem olhar o
       arquivo de origem. Em produção é o que se quer; em desenvolvimento é
       uma armadilha: trocar uma foto pelo mesmo nome não muda nada na tela —
       nem com recarga forçada, porque a teimosia é do servidor, não do
       navegador —, e o cache vive em .next/dev/cache/images. Zero aqui faz
       ele conferir a origem a cada pedido. */
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 0 : 14400,
  },
  /* A LP do KMEP mudou de /kmep-ultra para /kmep. Permanente, e antes do
     sistema de arquivos: a rota antiga não chega a renderizar. */
  async redirects() {
    return [{ source: "/kmep-ultra", destination: "/kmep", permanent: true }];
  },
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
