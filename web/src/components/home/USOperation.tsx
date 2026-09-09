import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Pill, Rule } from "@/components/ui";
import { TrialForm } from "./TrialForm";
import { usOperation } from "@/content/home";

/** Onde o lead entra: formulário à esquerda, contato dos EUA à direita. */
export function USOperation() {
  return (
    <section id="us-operation" className="bg-white py-[clamp(48px,6vw,88px)]">
      <div className="wrap grid grid-cols-1 gap-[clamp(28px,4vw,84px)] min-[1101px]:grid-cols-[900fr_325fr]">
        <div>
          <Reveal
            replay
            stagger={0.1}
            targetSelector="[data-us-intro-item]"
            className="mb-[clamp(24px,3.2vw,56px)]"
          >
            <div
              data-us-intro-item=""
              className="mb-[clamp(14px,1.2vw,22px)] flex items-center gap-[clamp(12px,1.2vw,20px)]"
            >
              <Pill>{usOperation.eyebrow}</Pill>
              <Rule short />
            </div>
            <div className="grid grid-cols-1 items-center gap-[clamp(16px,4vw,68px)] min-[1101px]:grid-cols-[505fr_293fr]">
              <h2 data-us-intro-item="" className="text-h2 leading-[0.967] text-ink">
                {usOperation.headline}
              </h2>
              <p data-us-intro-item="" className="font-light leading-[1.5] text-muted">
                {usOperation.body}
              </p>
            </div>
          </Reveal>

          <Reveal
            replay
            y={18}
            stagger={0.045}
            targetSelector="[data-trial-item]"
          >
            <TrialForm />
          </Reveal>
        </div>

        <Reveal
          as="aside"
          replay
          y={18}
          stagger={0.055}
          targetSelector="[data-us-aside-item]"
          className="border-t border-ink/15 pt-[clamp(24px,3vw,40px)] min-[1101px]:border-t-0 min-[1101px]:border-l min-[1101px]:pt-0 min-[1101px]:pl-[clamp(20px,2.6vw,44px)]"
        >
          <p
            data-us-aside-item=""
            className="mb-[clamp(10px,1vw,18px)] font-display text-[clamp(11px,0.9vw,17px)] font-semibold tracking-[0.05em] text-lime uppercase"
          >
            {usOperation.eyebrow}
          </p>
          <div data-us-aside-item="">
            <Rule className="mb-[clamp(14px,1.3vw,24px)] w-[47.5px]!" />
          </div>

          <h3
            data-us-aside-item=""
            className="mb-[clamp(12px,1.2vw,20px)] text-[clamp(16px,1.1vw,21px)] font-semibold tracking-[-0.02em]"
          >
            {usOperation.contact.name}
          </h3>
          <p data-us-aside-item="" className="mb-[1em] font-light leading-[1.5] text-muted">
            {usOperation.contact.address.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <p data-us-aside-item="" className="mb-[1em] font-light leading-[1.5] text-muted">
            {usOperation.contact.body}
          </p>

          <div className="mt-[clamp(24px,3.2vw,54px)] grid gap-[12px]">
            <p
              data-us-aside-item=""
              className="font-display text-[clamp(11px,0.9vw,17px)] font-semibold tracking-[0.05em] text-lime uppercase"
            >
              {usOperation.alternatives.title}
            </p>

            {usOperation.alternatives.actions.map((action) => (
              <a
                key={action.id}
                data-us-aside-item=""
                href={action.href}
                className="flex items-center gap-[clamp(14px,1.5vw,24px)] rounded-lg border border-muted-dark p-[clamp(14px,1.2vw,20px)] transition-colors hover:border-lime hover:bg-lime/6"
              >
                <Image
                  src={action.icon}
                  alt=""
                  width={45}
                  height={45}
                  className="h-auto w-[clamp(36px,2.1vw,40px)] shrink-0"
                />
                <span className="flex-1 text-small leading-[1.33] tracking-[-0.02em]">
                  {action.label}
                </span>
                <Image
                  src="/img/icon-arrow.svg"
                  alt=""
                  width={13}
                  height={15}
                  className="h-auto w-[13px] shrink-0"
                />
              </a>
            ))}

            <p
              data-us-aside-item=""
              className="mt-[clamp(12px,1.5vw,24px)] text-small text-muted"
            >
              {usOperation.alternatives.disclaimer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
