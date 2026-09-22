import { SmartLink } from "@/components/ui/SmartLink";
import { cn } from "@/lib/utils";

/**
 * Peças miúdas da LP do KMEP, repetidas em várias seções.
 *
 * A gramática é a da LP B do Aminosan — cápsula fina, caixa alta espaçada,
 * seta que anda no hover —, com uma variante a mais: a sólida em lima, que é
 * o pedido da faixa de teste. Ela aparece só onde o CTA principal aparece,
 * para o olho aprender que lima é "o próximo passo".
 */
export function Cta({
  href,
  children,
  tone = "light",
  solid = false,
  className,
}: {
  href: string;
  children: React.ReactNode;
  /** `light` para fundo escuro (contorno creme), `dark` para fundo claro. */
  tone?: "light" | "dark";
  /** O CTA principal: lima cheio, texto floresta, em qualquer fundo. */
  solid?: boolean;
  className?: string;
}) {
  return (
    <SmartLink
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full border px-5 py-3.5 text-center font-display text-[11px] leading-[1.3] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
        solid
          ? "border-lime bg-lime text-forest hover:border-offwhite hover:bg-offwhite"
          : tone === "light"
            ? "border-cream/45 text-cream hover:border-cream hover:bg-cream hover:text-forest"
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

/**
 * A etiqueta-pílula das referências: contorno de 1px, marcador redondo e os
 * itens separados por ponto médio. Quebra em duas linhas no celular sem virar
 * uma cápsula deformada — o raio encolhe junto.
 */
export function Pill({
  items,
  tone = "light",
  className,
}: {
  items: readonly string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-[14px] border px-4 py-2 font-display text-[10px] leading-[1.4] tracking-[0.16em] uppercase sm:rounded-full sm:text-[11px] sm:tracking-[0.2em]",
        tone === "light" ? "border-cream/30 bg-night/25 text-cream backdrop-blur-md" : "border-forest/20 text-forest",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-lime" />
      {items.map((item, i) => (
        <span key={item} className="inline-flex items-center gap-2">
          {i > 0 && <span aria-hidden className="opacity-50">·</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

/** A cruz fina que abre cada cartão e cada ponto, herdada da LP B. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={cn("size-3.5", className)}>
      <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Texto miúdo em caixa alta — o corpo "de legenda" da página. */
export const microCaps = "font-display text-[11px] leading-[1.5] tracking-[0.14em] uppercase";

/** Rótulo de seção: a caixa alta espaçada que abre um bloco. */
export const eyebrow = "font-display text-[11px] leading-[1.4] tracking-[0.22em] uppercase";

/**
 * Gerador com semente: posições iguais no servidor e no cliente. O mesmo do
 * Converge.tsx da LP B — um `Math.random()` aqui seria erro de hidratação.
 */
export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Arredonda o que vai para um atributo. Trigonometria pode diferir no último
 * dígito entre o Node e o navegador, e um atributo com quinze casas
 * diferentes é erro de hidratação — foi o bug da tentativa anterior desta
 * página. Todo número calculado que vai para a marcação passa por aqui.
 */
export const fix = (n: number, places = 2) => +n.toFixed(places);
