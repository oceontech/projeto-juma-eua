import type { Metadata } from "next";
import { Hero } from "@/components/kmep/Hero";
import { Specimen } from "@/components/kmep/Specimen";
import { Blackout } from "@/components/kmep/Blackout";
import { TwoJobs } from "@/components/kmep/TwoJobs";
import { Potassium } from "@/components/kmep/Potassium";
import { Flush } from "@/components/kmep/Flush"; // HOLD P2 — remover junto com Flush.tsx
import { Operation } from "@/components/kmep/Operation";
import { Proof } from "@/components/kmep/Proof";
import { Timing } from "@/components/kmep/Timing";
import { Fit } from "@/components/kmep/Fit";
import { Strip } from "@/components/kmep/Strip";
import { Questions } from "@/components/kmep/Questions";
import { Final } from "@/components/kmep/Final";

export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "One pass, two jobs: foliar potassium in the weeks that set yield and quality, in the spray pass you already run. For orchards, vegetables, ornamentals and row crops.",
  /* Versão B do teste A/B: a canônica é /kmep. */
  alternates: { canonical: "/kmep" },
};

/**
 * LP do KMEP Ultra®, versão B (rota /kmep-b) — a candidata do teste A/B que
 * entra pelo produto (docs/05, K1 versão 2). A versão A está em /kmep.
 *
 * O hero leva a headline da versão 2, e a cena de partículas conta o produto
 * antes da necessidade: a passada, o potássio entrando pela folha, por que a
 * folha (a raiz que não recebe a tempo) e a espiga no enchimento. A falta vem
 * depois, no preto.
 *
 * Daí em diante a página é a mesma da versão A. O TwoJobs fica, mesmo com a
 * cena abrindo em "One pass. Two jobs.": é ali que o segundo trabalho, a ação
 * desalojante, aparece pela primeira vez.
 */
export default function KmepBPage() {
  return (
    <>
      <Specimen variant="b">
        <Hero variant="b" />
      </Specimen>
      <Blackout variant="b" />
      <TwoJobs />
      <Potassium />
      {/* HOLD P2 — remover junto com Flush.tsx */}
      <Flush />
      <Operation />
      <Proof />
      <Timing />
      <Fit />
      <Strip />
      <Questions />
      <Final />
    </>
  );
}
