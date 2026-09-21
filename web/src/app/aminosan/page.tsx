import type { Metadata } from "next";
import { Hero } from "@/components/aminosan/Hero";
import { NitrogenProcess } from "@/components/aminosan/NitrogenProcess";
import { VideoSection } from "@/components/aminosan/VideoSection";
import { AminoAcidDelivery } from "@/components/aminosan/AminoAcidDelivery";
import { OperationalBenefits } from "@/components/aminosan/OperationalBenefits";
import { FieldResults } from "@/components/aminosan/FieldResults";
import { CompanyStory } from "@/components/aminosan/CompanyStory";
import { ProductDetails } from "@/components/aminosan/ProductDetails";
import { Faq } from "@/components/aminosan/Faq";
import { TrialRequest } from "@/components/aminosan/TrialRequest";

export const metadata: Metadata = {
  title: "Aminosan®",
  description:
    "Free amino acids, delivered ready to use. In the field for 40 years.",
};

/** LP do Aminosan — layout do Figma (node 2:316 / 56:408). */
export default function AminosanPage() {
  return (
    <>
      <Hero />
      {/* O hero revela esta seção esmaecendo sobre ela, e o corte dele acaba
          em branco: por isso a passagem clara fica FORA do trecho escuro — o
          tom da barra é medido por essas faixas, e uma faixa branca
          declarada escura deixaria a tipografia dela ilegível no meio da
          travessia. */}
      <section id="nitrogen-process" className="overflow-x-clip bg-black">
        <NitrogenProcess />
        <div data-nav-theme="dark">
          <VideoSection />
        </div>
      </section>
      <AminoAcidDelivery />
      <OperationalBenefits />
      <FieldResults />
      <CompanyStory />
      <ProductDetails />
      <Faq />
      <TrialRequest />
    </>
  );
}
