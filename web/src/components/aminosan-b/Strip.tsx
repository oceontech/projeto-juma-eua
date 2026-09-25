"use client";

import { useContent } from "@/components/layout/LocaleProvider";
import { Strip as TrialStrip } from "@/components/kmep/Strip";

/** A faixa de teste: a seção do KMEP (K15), com a copy do Aminosan®. */
export function Strip() {
  const { strip } = useContent().aminosanB;
  return <TrialStrip data={strip} />;
}
