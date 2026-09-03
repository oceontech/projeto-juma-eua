import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "Foliar potassium that goes in the tank with your insecticide and drives the target out of hiding.",
};

/**
 * LP do KMEP Ultra — 12 seções (K1 a K12), duas trilhas.
 *
 * A estrutura da página está em docs/03-SITE.md e a copy validada está no
 * protótipo em site/kmep-ultra.html. Falta o layout do Figma: quando ele
 * sair, esta rota recebe os componentes como a home recebeu.
 */
export default function KmepUltraPage() {
  return (
    <section className="wrap py-sec">
      <h1 className="text-h1 text-ink">KMEP Ultra®</h1>
      <p className="mt-6 max-w-[60ch] text-muted">
        Página em construção. A copy validada está no protótipo
        (<code>site/kmep-ultra.html</code>); o layout ainda não saiu do Figma.
      </p>
    </section>
  );
}
