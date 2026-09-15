import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { Reveal } from "@/components/motion/Reveal";
import { getContent } from "@/lib/locale";
import { BackToTop } from "./BackToTop";
import s from "./SiteFooter.module.css";

/**
 * Rodapé: um card escuro que sobe sobre o fim da última seção. Chamada para a
 * faixa de teste no alto, navegação enxuta no meio, avisos legais embaixo e a
 * marca grande assinando o pé.
 */
export async function SiteFooter() {
  const { footer } = (await getContent()).home;

  return (
    <footer className={s.footer} data-nav-theme="dark">
      <div className={s.inner}>
        <Reveal replay y={28} stagger={0.08} targetSelector="[data-footer-cta]" className={s.cta}>
          <p data-footer-cta className={s.ctaEyebrow}>
            <span aria-hidden />
            {footer.cta.eyebrow}
          </p>
          <h2 data-footer-cta className={s.ctaTitle}>
            {footer.cta.title}
          </h2>
          <div data-footer-cta className={s.ctaAction}>
            <SmartLink href="/#us-operation" className={s.ctaButton}>
              {footer.cta.button}
              <span aria-hidden className={s.ctaArrow}>
                <svg viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </SmartLink>
          </div>
        </Reveal>

        <Reveal replay y={20} stagger={0.06} targetSelector="[data-footer-col]" className={s.grid}>
          <div data-footer-col className={s.brand}>
            <Image
              src="/img/logo-juma-2026.png"
              alt={`${footer.brand.name} ${footer.brand.suffix}`}
              width={450}
              height={229}
              className={s.logo}
            />
            <p className={s.address}>{footer.address}</p>
            <p className={s.parent}>{footer.parent}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} data-footer-col aria-label={column.title}>
              <h3 className={s.colTitle}>{column.title}</h3>
              <ul className={s.links}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink href={link.href} className={s.link}>
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div data-footer-col className={s.top}>
            <BackToTop label={footer.backToTop} />
          </div>
        </Reveal>

        <div className={s.legal}>
          <p className={s.disclaimer}>{footer.disclaimer}</p>
          <p className={s.copyright}>{footer.copyright}</p>
        </div>
      </div>

      <p aria-hidden className={s.wordmark}>
        {footer.brand.name}
      </p>
    </footer>
  );
}
