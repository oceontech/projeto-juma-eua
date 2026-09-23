import type { Metadata } from "next";
import { Scan } from "@/components/aminosan-c/Scan";
import { Spec } from "@/components/aminosan-c/Spec";
import { Window } from "@/components/aminosan-c/Window";
import { Request } from "@/components/aminosan-c/Request";

export const metadata: Metadata = {
  title: "Aminosan®",
  description:
    "100% free-form L-amino acids with N, P and K, straight to the leaf in the pass you already make.",
  /* Terceira versão do teste: a canônica continua sendo /aminosan. */
  alternates: { canonical: "/aminosan" },
};

/**
 * LP C do Aminosan — a versão de instrumento.
 *
 * Registro oposto ao da B: fundo escuro, tipografia de painel, e uma cena que
 * não ilustra o produto, **analisa** uma amostra dele. A fotografia do hero é
 * a própria nuvem de partículas: ela se fragmenta a partir de si mesma e
 * passa por quatro leituras — a unidade, a cadeia, as unidades livres e a
 * folha. Ver `components/aminosan-c/Scan.tsx`.
 *
 * O arco é o diferencial mais duro do rótulo, a forma livre, e a página
 * inteira existe para explicá-lo. A B continua no ar, intacta: as três
 * versões dividem o mesmo Server Action e se separam pelo campo `source`.
 */
export default function AminosanCPage() {
  return (
    <>
      <Scan />
      <Spec />
      <Window />
      <Request />
    </>
  );
}
