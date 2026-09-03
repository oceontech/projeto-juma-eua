import Link from "next/link";
import type { ComponentProps } from "react";

type SmartLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
};

/**
 * Link que sabe a diferença entre trocar de rota e pular para uma âncora.
 *
 * `next/link` faz o próprio scroll ao navegar, inclusive para `#alvo` na
 * mesma página — e esse salto instantâneo atropela a rolagem suave do
 * ScrollToPlugin (SmoothAnchors.tsx). Para âncoras, um `<a>` comum: o
 * listener delegado cancela o comportamento padrão e anima.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
