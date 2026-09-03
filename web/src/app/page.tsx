import { Hero } from "@/components/home/Hero";
import { BrazilAdvantage } from "@/components/home/BrazilAdvantage";
import { PerformanceProof } from "@/components/home/PerformanceProof";
import { Expertise } from "@/components/home/Expertise";
import { Products } from "@/components/home/Products";
import { CropSelection } from "@/components/home/CropSelection";
import { Programs } from "@/components/home/Programs";
import { TrialStrip } from "@/components/home/TrialStrip";
import { USOperation } from "@/components/home/USOperation";

/**
 * Home USA.
 *
 * A ordem das seções é a do layout do Figma. Cada uma é um componente
 * próprio em src/components/home/ — as que precisam de DOM (hero, comparador,
 * leque, formulário) são Client Components; o resto renderiza no servidor.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <BrazilAdvantage />
      <PerformanceProof />
      <Expertise />
      <Products />
      <CropSelection />
      <Programs />
      <TrialStrip />
      <USOperation />
    </>
  );
}
