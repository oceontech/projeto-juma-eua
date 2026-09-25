import type { Metadata } from "next";
import { Hero } from "@/components/aminosan-b/Hero";
import { Specimen } from "@/components/aminosan-b/Specimen";
import { Field } from "@/components/aminosan-b/Field";
import { Assembly } from "@/components/aminosan-b/Assembly";
import { Meet } from "@/components/aminosan-b/Meet";
import { Cell } from "@/components/aminosan-b/Cell";
import { Compare } from "@/components/aminosan-b/Compare";
import { Rule } from "@/components/aminosan-b/Rule";
import { Heritage } from "@/components/aminosan-b/Heritage";
import { Timing } from "@/components/aminosan-b/Timing";
import { Season } from "@/components/aminosan-b/Season";
import { Label } from "@/components/aminosan-b/Label";
import { Fit } from "@/components/aminosan-b/Fit";
import { Strip } from "@/components/aminosan-b/Strip";
import { Questions } from "@/components/aminosan-b/Questions";
import { Final } from "@/components/aminosan-b/Final";

export const metadata: Metadata = {
  title: "Aminosan®",
  description:
    "100% free-form L-amino acids with N, P and K, straight to the leaf in the pass you already make.",
};

/**
 * LP principal do Aminosan® (rota /aminosan). Nasceu como versão B do teste
 * A/B e trocou de lugar com a primeira, que foi para /aminosan-b.
 *
 * **Revisão de 25/09/2026**, para ficar à altura da LP do KMEP: a página
 * passou a seguir o arco do docs/03-SITE.md (A1–A11) com seções construídas
 * sob medida.
 *
 * O hero se desfaz em partículas e a nuvem explica o aminoácido livre; a
 * cena fecha no disco preto que abre o campo (Field). Daí a linha de
 * montagem do nitrogênio e as duas rotas (Assembly, A3–A4), o produto em
 * bento (Meet), a lente dentro da folha (Cell), a tabela contra o hidrolisado
 * típico (Compare, A4), a prova pela regra da testemunha (Rule, A6), a
 * história mais antiga que a empresa (Heritage, A8), as culturas de mercado
 * (Season) e a janela no mostrador da safra (Timing, A9), a ficha da
 * bombona (Label), para quem é (Fit), a faixa de teste (Strip), as perguntas
 * (A11) e o pedido.
 */
export default function AminosanPage() {
  return (
    <>
      {/* O hero mora dentro da cena: os dois travam juntos enquanto a foto
          se fragmenta em partículas e a nuvem passa pelas quatro leituras. */}
      <Specimen>
        <Hero />
      </Specimen>
      {/* A virada para o campo: o preto abre da folha, pergunta, e percorre
          os resultados da folha à raiz. */}
      <Field />
      <Assembly />
      <Meet />
      <Cell />
      <Compare />
      <Rule />
      <Heritage />
      <Season />
      <Timing />
      <Label />
      <Fit />
      <Strip />
      <Questions />
      <Final />
    </>
  );
}
