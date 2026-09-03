import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aminosan®",
  description:
    "Free amino acids, delivered ready to use. In the field for 40 years.",
};

/**
 * LP do Aminosan — 12 seções (A1 a A12).
 *
 * Mesma situação da LP do KMEP: copy validada no protótipo
 * (site/aminosan.html), layout do Figma pendente.
 */
export default function AminosanPage() {
  return (
    <section className="wrap py-sec">
      <h1 className="text-h1 text-ink">Aminosan®</h1>
      <p className="mt-6 max-w-[60ch] text-muted">
        Página em construção. A copy validada está no protótipo
        (<code>site/aminosan.html</code>); o layout ainda não saiu do Figma.
      </p>
    </section>
  );
}
