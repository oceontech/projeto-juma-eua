"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
 *
 * As âncoras do conteúdo (`#us-operation`, `#brazil`…) moram na home: fora
 * dela (blog, LPs) o link vira `/#alvo` e leva à home já na seção.
 */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  const pathname = usePathname();

  if (href.startsWith("#")) {
    if (pathname !== "/") {
      return (
        <Link href={`/${href}`} {...rest}>
          {children}
        </Link>
      );
    }
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
