import type { ReactNode } from "react";

/** Junta classes ignorando falsy. Evita puxar clsx para três usos. */
export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Eyebrow em caixa lima — abre as seções de método e de operação. */
export function Pill({
  children,
  dark,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center justify-center rounded-full font-semibold leading-none whitespace-nowrap",
        "px-[clamp(13px,1vw,18px)] py-[clamp(8px,0.7vw,12px)] text-micro tracking-[0.15em]",
        dark ? "bg-[#0E0E0D] text-offwhite" : "bg-lime text-[#0E0E0D]",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Traço lima. Abre quase toda seção do layout. */
export function Rule({
  className,
  short,
}: {
  className?: string;
  short?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "block h-[3px] rounded-[2px] bg-lime",
        short
          ? "w-[clamp(50px,5.2vw,100px)]"
          : "w-[clamp(75px,7.8vw,150px)]",
        className,
      )}
    />
  );
}

/**
 * Cabeçalho de seção do layout: título à esquerda, texto de apoio à direita.
 * Abaixo de 1100px empilha — foi assim que o frame mobile resolveu.
 */
export function SectionIntro({
  children,
  aside,
  className,
}: {
  children: ReactNode;
  aside: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "grid grid-cols-1 items-start gap-[clamp(24px,4vw,80px)] min-[1100px]:grid-cols-2",
        className,
      )}
    >
      <div>{children}</div>
      <div className="max-w-[46ch] min-[1100px]:justify-self-end">{aside}</div>
    </div>
  );
}
