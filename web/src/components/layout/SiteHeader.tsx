"use client";

import { useState } from "react";
import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { nav } from "@/content/home";
import { cx } from "@/components/ui";

/**
 * Barra flutuante do topo. Sticky, com margem negativa para o hero passar
 * por baixo dela — é o que o layout do Figma faz.
 *
 * Acima de 1150px a barra mostra o menu inteiro; abaixo disso o menu central
 * colidiria com o botão de trial, então vira hambúrguer.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const linkClass =
    "font-display text-[clamp(11px,0.73vw,14px)] font-semibold uppercase tracking-[0.21em] whitespace-nowrap text-muted transition-colors hover:text-green-brand";

  return (
    <header className="sticky top-[clamp(12px,1.6vw,30px)] z-[60] mb-[calc(-1*clamp(53px,3.5vw,66px))]">
      <div className="mx-auto flex w-[min(1319px,calc(100%-2*var(--spacing-gut)))] items-center justify-between gap-[clamp(12px,1.5vw,24px)] rounded-full border border-white bg-white/65 px-[clamp(14px,1.5vw,24px)] py-[clamp(10px,1vw,16px)] backdrop-blur-[6.35px]">
        <div
          className="flex flex-1 items-center min-[1151px]:flex-none"
          role="group"
          aria-label="Language"
        >
          <button
            type="button"
            aria-pressed={false}
            aria-label="Português (Brasil)"
            className="cursor-pointer leading-none opacity-45 transition-opacity hover:opacity-100"
          >
            <Image
              src="/img/flag-br.png"
              alt=""
              width={45}
              height={24}
              className="w-[clamp(30px,2.35vw,45px)] rounded-l-[2px]"
            />
          </button>
          <button
            type="button"
            aria-pressed
            aria-label="English (United States)"
            className="cursor-pointer leading-none opacity-100"
          >
            <Image
              src="/img/flag-us.png"
              alt=""
              width={45}
              height={24}
              className="w-[clamp(30px,2.35vw,45px)] rounded-r-[2px]"
            />
          </button>
        </div>

        <nav
          aria-label="Main"
          className="flex flex-none items-center justify-center gap-[clamp(16px,2vw,40px)] min-[1151px]:flex-1 min-[1151px]:justify-between"
        >
          <div className="hidden gap-[clamp(16px,1.7vw,30px)] min-[1151px]:flex">
            {nav.left.map((item) => (
              <SmartLink key={item.label} href={item.href} className={linkClass}>
                {item.label}
              </SmartLink>
            ))}
          </div>

          <SmartLink href="/" aria-label="Juma-Agro — homepage" className="shrink-0">
            <Image
              src="/img/logo-juma.svg"
              alt="Juma-Agro"
              width={250}
              height={30}
              priority
              className="w-[clamp(150px,13vw,250px)]"
            />
          </SmartLink>

          <div className="hidden gap-[clamp(16px,1.7vw,30px)] min-[1151px]:flex">
            {nav.right.map((item) => (
              <SmartLink key={item.label} href={item.href} className={linkClass}>
                {item.label}
              </SmartLink>
            ))}
          </div>
        </nav>

        <SmartLink
          href={nav.cta.href}
          className="hidden items-center justify-center rounded-[99px] bg-green-brand px-6 py-3 font-display text-[12px] font-semibold tracking-[0.05em] whitespace-nowrap text-white uppercase transition-colors hover:bg-[#036231] min-[1151px]:inline-flex"
        >
          {nav.cta.label}
        </SmartLink>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 cursor-pointer justify-end p-1.5 min-[1151px]:hidden"
        >
          <span className="grid gap-1">
            <span className="block h-[2px] w-5 rounded-[2px] bg-ink" />
            <span className="block h-[2px] w-5 rounded-[2px] bg-ink" />
            <span className="block h-[2px] w-[13px] rounded-[2px] bg-ink" />
          </span>
        </button>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main (mobile)"
        hidden={!open}
        onClick={() => setOpen(false)}
        className={cx(
          "mx-auto mt-2.5 w-[min(1319px,calc(100%-2*var(--spacing-gut)))] gap-1 rounded-[22px] bg-white/95 px-6 py-[18px] backdrop-blur-[6.35px]",
          open ? "grid" : "hidden",
        )}
      >
        {[...nav.left, ...nav.right, nav.cta].map((item) => (
          <SmartLink
            key={item.label}
            href={item.href}
            className="py-2 font-display text-[13px] font-semibold tracking-[0.18em] text-muted uppercase"
          >
            {item.label}
          </SmartLink>
        ))}
      </nav>
    </header>
  );
}
