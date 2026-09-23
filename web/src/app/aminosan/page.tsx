import type { Metadata } from "next";
import { Hero } from "@/components/aminosan-b/Hero";
import { Specimen } from "@/components/aminosan-b/Specimen";
import { Field } from "@/components/aminosan-b/Field";
import { Problem } from "@/components/aminosan-b/Problem";
import { Converge } from "@/components/aminosan-b/Converge";
import { Meet } from "@/components/aminosan-b/Meet";
import { Cell } from "@/components/aminosan-b/Cell";
import { Proof } from "@/components/aminosan-b/Proof";
import { Timing } from "@/components/aminosan-b/Timing";
import { Season } from "@/components/aminosan-b/Season";
import { Inside } from "@/components/aminosan-b/Inside";
import { Questions } from "@/components/aminosan-b/Questions";
import { Final } from "@/components/aminosan-b/Final";

export const metadata: Metadata = {
  title: "Aminosan®",
  description:
    "100% free-form L-amino acids with N, P and K, straight to the leaf in the pass you already make.",
};

/**
 * LP principal do Aminosan (rota /aminosan). Nasceu como versão B do teste
 * A/B e trocou de lugar com a primeira, que foi para /aminosan-b.
 * Estrutura e ritmo seguem a referência editorial (hero de produto com
 * parallax de entrada que se desfaz em partículas — origem vegetal e forma
 * do aminoácido —, problema em tela dividida, convergência, produto em bento grid com vídeo em loop,
 * dentro da folha (lente de microscópio),
 * prova, janela crítica, fichas de cultura, o que tem na bombona, trilho
 * de perguntas, pedido).
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
      <Problem />
      <Converge />
      <Meet />
      <Cell />
      <Proof />
      <Timing />
      <Season />
      <Inside />
      <Questions />
      <Final />
    </>
  );
}
