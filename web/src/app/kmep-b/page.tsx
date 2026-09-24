import type { Metadata } from "next";
import { Hero } from "@/components/kmep/Hero";
import { Specimen } from "@/components/kmep/Specimen";
import { Blackout } from "@/components/kmep/Blackout";
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
  /* Versão B do teste A/B: a canônica é /kmep. */
  alternates: { canonical: "/kmep" },
};

/**
 * LP do KMEP Ultra®, versão B (rota /kmep-b) — a candidata do teste A/B que
 * entra pelo produto (docs/05, K1 versão 2). A versão A está em /kmep.
 *
 * O hero leva a headline da versão 2, e a cena de partículas conta uma
 * passada, dois trabalhos: a barra, a gota que fica (trabalho 1), o
 * potássio entrando pela folha (trabalho 2) e a espiga no enchimento — é o
 * K5 em desenho, e por isso o TwoJobs não entra. A perda vem depois, no
 * preto: o que a cabine não mostra, o potássio que o solo não entrega a
 * tempo, e o ensaio. O Problem e o Cost ficam de fora pelo mesmo motivo da A.
 *
 * Daí em diante a página é a mesma da versão A.
 */
export default function KmepBPage() {
  return (
    <>
      <Specimen variant="b">
        <Hero variant="b" />
      </Specimen>
      <Blackout variant="b" />
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
