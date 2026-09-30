"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

import { Engagement } from "./Engagement";

/** Script do Umami, fora da prévia do painel (o post em edição não é visita). */
export function Tracker({ src, id, domains }: { src: string; id: string; domains?: string }) {
  const pathname = usePathname();
  if (pathname.startsWith("/blog/preview")) return null;
  return (
    <>
      <Script src={src} data-website-id={id} data-domains={domains || undefined} strategy="afterInteractive" />
      <Engagement />
    </>
  );
}
