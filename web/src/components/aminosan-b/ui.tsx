import { SmartLink } from "@/components/ui/SmartLink";
import { cn } from "@/lib/utils";

/**
 * Peças miúdas da LP B, repetidas em várias seções.
 *
 * O botão é a cápsula fina da referência: contorno de 1px, caixa alta
 * espaçada, seta que anda no hover. Uma variante por fundo, e só.
 */
export function Cta({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** `light` para fundo escuro (contorno creme), `dark` para fundo claro. */
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full border px-5 py-3 font-display text-[11px] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
        tone === "light"
          ? "border-cream/50 text-cream hover:border-cream hover:bg-cream hover:text-forest"
          : "border-forest/40 text-forest hover:border-forest hover:bg-forest hover:text-cream",
        className,
      )}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </SmartLink>
  );
}

/** A cruz fina que abre cada cartão e cada ponto, como na referência. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("size-3.5", className)}>
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Texto miúdo em caixa alta — o corpo "de legenda" da referência. */
/** Texto descritivo curto: caixa baixa, com maiúscula só onde a pontuação pede. */
export const microText = "font-display text-[13px] leading-[1.5] tracking-[0.005em]";

export const microCaps = "font-display text-[11px] leading-[1.5] tracking-[0.14em] uppercase";

/** Rótulo de seção: a caixa alta espaçada que abre um bloco (a mesma do KMEP). */
export const eyebrow = "font-display text-[11px] leading-[1.4] tracking-[0.22em] uppercase";

/**
 * As cores da bombona, que são a identidade do Aminosan® na página: o azul da
 * faixa do rótulo (`amino`), o verde do logotipo e o âmbar que a cena de
 * partículas usa para "a ligação que ainda precisa ser aberta" — aqui, o custo
 * de cada conversão.
 */
export const AMINO = { blue: "#134777", green: "#1F7A44", amber: "#C9731E" };

/**
 * Arredonda o que vai para um atributo: trigonometria pode diferir no último
 * dígito entre o Node e o navegador, e isso é erro de hidratação.
 */
export const fix = (n: number, places = 2) => +n.toFixed(places);
