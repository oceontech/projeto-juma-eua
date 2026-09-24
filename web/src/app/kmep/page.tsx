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
    "A 1-1-15 liquid potassium that rides in the spray pass you already run, putting potassium on the leaf in the weeks that set yield and quality. For orchards, vegetables, ornamentals and row crops.",
};

/**
 * LP do KMEP Ultra®, versão A (a versão B, que entra pelo produto, está em
 * /kmep-b).
 *
 * **Nutrição primeiro (revisão de 24/09/2026).** A página conta o potássio
 * foliar como o motivo de compra e a ação desalojante como o segundo trabalho
 * da mesma passada. A tecnologia de aplicação (cobertura, deposição, a gota
 * na cera, o túnel de vento) saiu inteira: as seções Deposition (K6) e
 * Credential (K12) e as leituras de gota da cena.
 *
 * O hero se desfaz em partículas e a nuvem conta a necessidade — onde a
 * demanda de potássio chega ao pico, onde o solo trava, o potássio entrando
 * pela folha, a passada que o produtor já faz. A cena fecha num disco preto
 * que abre o Blackout: o que a falta de potássio custa, e o ensaio. Daí a
 * passada que faz dois trabalhos (K5), o potássio com seção própria e maior
 * (K7), e a ação desalojante (K8).
 *
 * Copy: docs/05-COPY-KMEP-ULTRA.md, o canônico.
 *
 * <Flush /> (K8) está em HOLD pela P2 e sai com a linha de import e a de JSX
 * abaixo, mais os trechos marcados HOLD P2 em content/kmep.ts (hero,
 * twoJobs, operation, questions) e o cartão do trabalho 2 em TwoJobs.tsx.
 */
export default function KmepPage() {
  return (
    <>
      {/* O hero mora dentro da cena: os dois travam juntos enquanto a foto
          se fragmenta em partículas e a nuvem passa pelas quatro leituras. */}
      <Specimen variant="a">
        <Hero />
      </Specimen>
      {/* O preto abre do disco da cena: o que a falta custa, e o ensaio. */}
      <Blackout variant="a" />
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
