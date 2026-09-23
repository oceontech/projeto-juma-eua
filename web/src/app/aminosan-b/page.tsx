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
  /* Versão anterior da LP, guardada em /aminosan-b: a canônica é /aminosan. */
  alternates: { canonical: "/aminosan" },
};

/** Versão anterior da LP do Aminosan (rota /aminosan-b) — layout do Figma
    (node 2:316 / 56:408). A principal é a de components/aminosan-b. */
export default function AminosanBPage() {
  return (
    <>
      <Hero />
      {/* O hero revela esta seção esmaecendo sobre ela, e o corte dele acaba
          em branco — o papel do diagrama está a um passo desse branco, então
          a travessia é um esmaecimento e não um corte de cor.

          O palco do vídeo divide o mesmo branco: da saída da hero até a
          seção seguinte o fundo não muda uma vez, então a moldura lima cresce
          sobre a superfície que já estava ali e não há nenhuma travessia de
          cor para encenar. Nada aqui leva `data-nav-theme`: o trecho é claro
          inteiro, menos a foto da metade esquerda, e é o vidro claro da barra
          que sustenta a leitura por cima dela. */}
      <section id="nitrogen-process" className="overflow-x-clip bg-white">
        <NitrogenProcess />
        <VideoSection />
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
