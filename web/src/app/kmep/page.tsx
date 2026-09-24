import type { Metadata } from "next";
import { Hero } from "@/components/kmep/Hero";
import { Specimen } from "@/components/kmep/Specimen";
import { Blackout } from "@/components/kmep/Blackout";
import { TwoJobs } from "@/components/kmep/TwoJobs";
import { Deposition } from "@/components/kmep/Deposition";
import { Potassium } from "@/components/kmep/Potassium";
import { Flush } from "@/components/kmep/Flush"; // HOLD P2 — remover junto com Flush.tsx
import { Operation } from "@/components/kmep/Operation";
import { Proof } from "@/components/kmep/Proof";
import { Credential } from "@/components/kmep/Credential";
import { Timing } from "@/components/kmep/Timing";
import { Fit } from "@/components/kmep/Fit";
import { Strip } from "@/components/kmep/Strip";
import { Questions } from "@/components/kmep/Questions";
import { Final } from "@/components/kmep/Final";

export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "One pass, two jobs: better spray coverage and deposition, plus foliar potassium in the weeks that set the yield. For row crops, vegetables and orchards, in the spray pass you already run.",
};

/**
 * LP do KMEP Ultra®, versão A (a versão B, que entra pelo produto, está em
 * /kmep-b). O hero se desfaz em partículas e a nuvem conta a perda que não
 * se vê — a passada vista da cabine, o que parou no topo do dossel, o que
 * quicou e secou, e a mesma folha com o KMEP no tanque (K3 e K6 em
 * desenho). A cena fecha num disco preto que abre o Blackout: o K4 inteiro,
 * e o ensaio com a testemunha ao lado (o K2). Por isso o Problem e o Cost
 * não entram aqui. O Timing absorve a ficha de dose.
 *
 * Copy: docs/05-COPY-KMEP-ULTRA.md, o canônico. Plano de execução, gramática
 * visual e regras: docs/06-PROMPT-LP-KMEP.md. O design system e o movimento
 * são os da /aminosan-b; o que separa as duas páginas é a matéria (bico, gota,
 * ar, cera, a hora do dia) e o acento cobre, que aqui marca perda e custo.
 *
 * <Flush /> (K8) está em HOLD pela P2 e sai com a linha de import e a de JSX
 * abaixo, mais os dois trechos marcados em Operation.tsx e Questions.tsx.
 */
export default function KmepPage() {
  return (
    <>
      {/* O hero mora dentro da cena: os dois travam juntos enquanto a foto
          se fragmenta em partículas e a nuvem passa pelas quatro leituras. */}
      <Specimen variant="a">
        <Hero />
      </Specimen>
      {/* O preto abre do disco da cena: o que a perda custa, e o ensaio. */}
      <Blackout variant="a" />
      <TwoJobs />
      <Deposition />
      <Potassium />
      {/* HOLD P2 — remover junto com Flush.tsx */}
      <Flush />
      <Operation />
      <Proof />
      <Credential />
      <Timing />
      <Fit />
      <Strip />
      <Questions />
      <Final />
    </>
  );
}
