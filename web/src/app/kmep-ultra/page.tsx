import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "One pass, two jobs: better spray coverage and deposition, plus foliar potassium for grain fill. Six dollars an acre, in the insecticide pass you already run.",
};

/**
 * LP do KMEP Ultra — 17 seções (K1 a K17), uma trilha só.
 *
 * **A copy e o posicionamento estão em `docs/05-COPY-KMEP-ULTRA.md`**, que é o
 * documento canônico: texto pronto em inglês, estrutura, mapa de objeções e o
 * que cada bloco depende. O protótipo `site/kmep-ultra.html` tem a versão
 * anterior da copy (onze seções) e serve de referência de blocos de prova e
 * FAQ, não de posicionamento.
 *
 * O eixo, em uma linha: a página entra pelo problema de performance de
 * aplicação — como o folheto americano da Juma já comunica o produto — e
 * entrega duas coisas no mesmo par, cobertura e deposição no dia da aplicação
 * e potássio foliar na janela do enchimento de grãos. A ação desalojante é
 * vantagem adicional e vive num bloco removível (pendência P2, FIFRA).
 *
 * Falta o layout do Figma: quando ele sair, esta rota recebe os componentes
 * como a home recebeu.
 */
export default function KmepUltraPage() {
  return (
    <section className="wrap py-sec">
      <h1 className="text-h1 text-ink">KMEP Ultra®</h1>
      <p className="mt-6 max-w-[60ch] text-muted">
        Página em construção. A copy está em <code>docs/05-COPY-KMEP-ULTRA.md</code>; o layout ainda
        não saiu do Figma.
      </p>
    </section>
  );
}
