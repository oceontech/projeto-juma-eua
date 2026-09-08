import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Pill, Rule } from "@/components/ui";
import { TrialForm } from "./TrialForm";
import { usOperation } from "@/content/home";

/** Onde o lead entra: formulário à esquerda, contato dos EUA à direita. */
export function USOperation() {
  return (
    <section id="us-operation" className="bg-white py-sec">
      <div className="wrap grid grid-cols-1 gap-[clamp(30px,4.9vw,135px)] min-[1101px]:grid-cols-[900fr_325fr]">
        <div>
          <Reveal className="mb-[clamp(30px,4.7vw,90px)]">
            <div className="mb-[clamp(18px,1.5vw,28px)] flex items-center gap-[clamp(12px,1.2vw,23px)]">
              <Pill>{usOperation.eyebrow}</Pill>
              <Rule short />
            </div>
            <div className="grid grid-cols-1 items-center gap-[clamp(24px,6.2vw,118px)] min-[1101px]:grid-cols-[505fr_293fr]">
              <h2 className="text-h2 leading-[0.967] text-ink">
                {usOperation.headline}
              </h2>
              <p className="font-light text-muted">{usOperation.body}</p>
            </div>
          </Reveal>

          <Reveal>
            <TrialForm />
          </Reveal>
        </div>

        <Reveal
          as="aside"
          className="border-t border-ink/15 pt-[clamp(30px,4vw,50px)] min-[1101px]:border-t-0 min-[1101px]:border-l min-[1101px]:pt-0 min-[1101px]:pl-[clamp(20px,3.5vw,68px)]"
        >
          <p className="mb-[clamp(14px,1.5vw,28px)] font-display text-[clamp(11px,1.05vw,20px)] font-semibold tracking-[0.05em] text-lime uppercase">
            {usOperation.eyebrow}
          </p>
          <Rule className="mb-[clamp(16px,1.7vw,33px)] w-[47.5px]!" />

          <h3 className="mb-[clamp(16px,1.5vw,28px)] text-[clamp(16px,1.25vw,24px)] font-semibold tracking-[-0.02em]">
            {usOperation.contact.name}
          </h3>
          <p className="mb-[1.5em] font-light text-muted">
            {usOperation.contact.address.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <p className="mb-[1.5em] font-light text-muted">
            {usOperation.contact.body}
          </p>

          <div className="mt-[clamp(34px,5.3vw,102px)] grid gap-[18px]">
            <p className="font-display text-[clamp(11px,1.05vw,20px)] font-semibold tracking-[0.05em] text-lime uppercase">
              {usOperation.alternatives.title}
            </p>

            {usOperation.alternatives.actions.map((action) => (
              <a
                key={action.id}
                href={action.href}
                className="flex items-center gap-[clamp(16px,2.2vw,43px)] rounded-lg border border-muted-dark p-[clamp(18px,1.6vw,30px)] transition-colors hover:border-lime hover:bg-lime/6"
              >
                <Image
                  src={action.icon}
                  alt=""
                  width={45}
                  height={45}
                  className="h-auto w-[44.5px] shrink-0"
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

            <p className="mt-[clamp(20px,2.2vw,42px)] text-small text-muted">
              {usOperation.alternatives.disclaimer}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
