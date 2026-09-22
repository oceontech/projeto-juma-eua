import type { Metadata } from "next";
import { Hero } from "@/components/kmep/Hero";
import { Problem } from "@/components/kmep/Problem";
import { Cost } from "@/components/kmep/Cost";
import { TwoJobs } from "@/components/kmep/TwoJobs";
import { Deposition } from "@/components/kmep/Deposition";
import { Potassium } from "@/components/kmep/Potassium";
import { Flush } from "@/components/kmep/Flush"; // HOLD P2 — remover junto com Flush.tsx
import { Operation } from "@/components/kmep/Operation";
import { Proof } from "@/components/kmep/Proof";
import { Economics } from "@/components/kmep/Economics";
import { Credential } from "@/components/kmep/Credential";
import { Timing } from "@/components/kmep/Timing";
import { Fit } from "@/components/kmep/Fit";
import { Strip } from "@/components/kmep/Strip";
import { Questions } from "@/components/kmep/Questions";
import { Final } from "@/components/kmep/Final";

export const metadata: Metadata = {
  title: "KMEP Ultra®",
  description:
    "One pass, two jobs: better spray coverage and deposition, plus foliar potassium for grain fill. Six dollars an acre, in the insecticide pass you already run.",
};

/**
 * LP do KMEP Ultra® — K1 a K17 em quinze componentes (o hero absorve a faixa
 * de prova K2; o Timing absorve a ficha de dose).
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
      <Hero />
      <Problem />
      <Cost />
      <TwoJobs />
      <Deposition />
      <Potassium />
      {/* HOLD P2 — remover junto com Flush.tsx */}
      <Flush />
      <Operation />
      <Proof />
      <Economics />
      <Credential />
      <Timing />
      <Fit />
      <Strip />
      <Questions />
      <Final />
    </>
  );
}
