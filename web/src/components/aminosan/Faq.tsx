"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { faq } from "@/content/aminosan";

export function Faq() {
  const [open, setOpen] = useState<number>(faq.items.findIndex((item) => item.openByDefault) ?? 0);

  return (
    <section className="bg-[#fffcf0] py-[clamp(56px,7vw,124px)]">
      <div className="wrap grid grid-cols-1 gap-[clamp(32px,4vw,80px)] lg:grid-cols-[427fr_762fr]">
        <Reveal y={18} className="lg:sticky lg:top-28 lg:self-start">
          <p className="font-display text-[16px] font-semibold tracking-[0.3em] text-lime uppercase">{faq.eyebrow}</p>
          <h2 className="mt-4 text-h2 leading-[1.05] text-ink">{faq.heading}</h2>
          <p className="mt-5 max-w-[42ch] leading-[1.55] text-muted">{faq.description}</p>

          <div className="relative mt-10 hidden aspect-[762/560] w-full overflow-hidden rounded-[20px] lg:block">
            <Image src="/img/aminosan/faq-plant.webp" alt="" fill className="object-cover" />
          </div>
        </Reveal>

        <div>
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question} className={i > 0 ? "border-t border-ink/10" : ""}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="font-display text-[clamp(17px,1.4vw,24px)] text-ink">{item.question}</span>
                  <span
                    className={`shrink-0 text-[20px] text-muted transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-[grid-template-rows] duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="min-h-0">
                    <p className="max-w-[62ch] pb-6 leading-[1.5] text-muted">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
