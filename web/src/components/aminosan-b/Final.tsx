"use client";

import Image from "next/image";
import { useActionState, useRef } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitLines } from "@/components/motion/SplitLines";
import { submitTrialRequest, type TrialRequestState } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { microCaps } from "./ui";

const initial: TrialRequestState = { status: "idle", message: "", errors: {} };

/**
 * Fecho da página: o pedido de faixa de teste. Usa a mesma Server Action da
 * LP A — o lead das duas versões cai no mesmo lugar, que é o que torna o
 * teste A/B comparável. O campo `source` diz de qual versão ele veio.
 */
export function Final() {
  const { final } = useContent().aminosanB;
  const scope = useRef<HTMLElement>(null);
  const [state, action, pending] = useActionState(submitTrialRequest, initial);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ scrollTrigger: { trigger: scope.current, start: "top 80%", end: "center center", scrub: 0.6 } })
          .fromTo(".fn-photo-wrap", { clipPath: "inset(12% 12% 12% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
          .fromTo(".fn-photo", { scale: 1.2 }, { scale: 1, ease: "none" }, 0);
        gsap.from(".fn-field", {
          opacity: 0,
          y: 20,
          stagger: 0.06,
          duration: 0.8,
          scrollTrigger: { trigger: ".fn-form", start: "top 88%", once: true },
        });
      });
    },
    { scope },
  );

  const fields = [
    { name: "name", type: "text", autoComplete: "name", ...final.fields.name },
    { name: "email", type: "email", autoComplete: "email", ...final.fields.email },
    { name: "state", type: "text", autoComplete: "address-level1", ...final.fields.state },
    { name: "crop", type: "text", autoComplete: "off", ...final.fields.crop },
  ] as const;

  return (
    <section
      id="trial-form"
      ref={scope}
      data-nav-theme="dark"
      className="grid bg-[linear-gradient(160deg,var(--color-olive)_0%,var(--color-forest)_70%)] text-cream lg:grid-cols-2"
    >
      <div className="flex flex-col px-[var(--spacing-gut)] py-[clamp(72px,8vw,124px)] lg:px-[clamp(40px,5vw,96px)]">
        <SplitLines className="text-[clamp(44px,5.4vw,104px)] leading-[0.92] tracking-[-0.04em]">
          {final.heading.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </SplitLines>
        <p className={`${microCaps} mt-6 max-w-[50ch] text-cream/75`}>{final.body}</p>

        {state.status === "success" ? (
          <p role="status" className="mt-12 border-l-2 border-lime pl-4 font-display text-[20px] leading-[1.3]">
            {state.message}
          </p>
        ) : (
          <form action={action} noValidate className="fn-form mt-12 grid gap-x-6 gap-y-7 sm:grid-cols-2">
            <input type="hidden" name="source" value="aminosan-b" />
            {fields.map((field) => (
              <label key={field.name} className="fn-field flex flex-col gap-2">
                <span className={`${microCaps} text-cream/60`}>{field.label}</span>
                <input
                  name={field.name}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  placeholder={field.placeholder}
                  aria-invalid={Boolean(state.errors[field.name])}
                  className={cn(
                    "border-b bg-transparent pb-2 font-display text-[18px] text-cream outline-none placeholder:text-cream/30 focus:border-lime",
                    state.errors[field.name] ? "border-[#FF8A6E]" : "border-cream/30",
                  )}
                />
                {state.errors[field.name] && <span className="text-[12px] text-[#FF8A6E]">{state.errors[field.name]}</span>}
              </label>
            ))}

            <label className="fn-field flex items-center gap-3 sm:col-span-2">
              <input type="checkbox" name="call" className="size-4 accent-lime" />
              <span className="text-[14px] text-cream/80">{final.call}</span>
            </label>

            <div className="fn-field flex flex-wrap items-center gap-5 sm:col-span-2">
              <button
                type="submit"
                disabled={pending}
                className="group inline-flex items-center gap-3 rounded-full bg-lime px-6 py-3.5 font-display text-[12px] font-medium tracking-[0.16em] text-forest uppercase transition-colors hover:bg-cream disabled:opacity-60"
              >
                {pending ? final.sending : final.submit}
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </button>
              <p className="max-w-[36ch] text-[12px] leading-[1.5] text-cream/55">{final.privacy}</p>
            </div>
            {state.status === "error" && (
              <p role="alert" className="text-[13px] text-[#FF8A6E] sm:col-span-2">
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>

      <div className="fn-photo-wrap relative min-h-[80svh] overflow-hidden lg:min-h-full">
        <Image
          src="/img/aminosan-b/final-grower.webp"
          alt={final.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="fn-photo object-cover object-[60%_center]"
        />
      </div>
    </section>
  );
}
