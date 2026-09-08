import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { brazil } from "@/content/home";

/**
 * O bloco que assume a origem brasileira em vez de esconder — regra do
 * projeto: dado brasileiro é identificado como brasileiro.
 *
 * Server Component: não tem interação, só a entrada, que fica no <Reveal>.
 */
export function BrazilAdvantage() {
  return (
    <section id="brazil" data-nav-theme="dark" className="bg-black pb-sec text-offwhite">
      <div className="wrap">
        <Reveal as="h2" replay className="mb-[clamp(34px,3.9vw,62px)] text-center text-h2 leading-[0.967] text-white">
          {brazil.title}
        </Reveal>

        <div className="grid grid-cols-1 gap-[clamp(16px,1.5vw,20px)] min-[861px]:grid-cols-[785fr_555fr]">
          <Reveal
            as="article"
            replay
            delay={0.12}
            className="relative flex flex-col gap-[clamp(14px,1.65vw,32px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(24px,2.6vw,50px)]"
          >
            {/* Vinheta clara no canto superior esquerdo, como no layout. */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-[14%] -left-[6%] h-[40%] w-[34%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]"
            />

            <span className="relative self-start rounded-lg bg-lime p-2.5 text-[clamp(11px,0.9vw,20px)] leading-none tracking-[0.15em] text-white">
              {brazil.history.badge}
            </span>
            <p className="relative font-display text-[clamp(45px,6.7vw,128px)] leading-[0.92] text-offwhite">
              {brazil.history.year}
            </p>
            <h3 className="relative max-w-[480px] text-h3 font-semibold text-offwhite">
              {brazil.history.title}
            </h3>
            <p className="relative max-w-[480px] leading-[1.5] font-light text-offwhite">
              {brazil.history.body}
            </p>

            <div className="relative mt-auto flex items-center gap-[clamp(8px,1.1vw,16px)]">
              <Image
                src="/img/julio-matino.jpg"
                alt=""
                width={58}
                height={58}
                className="size-[clamp(29px,3vw,58px)] rounded-full object-cover"
              />
              <div>
                <strong className="block font-display text-[clamp(11px,1.05vw,20px)] font-semibold text-offwhite">
                  {brazil.history.author.name}
                </strong>
                <span className="text-[clamp(8px,0.73vw,14px)] font-extralight text-offwhite/45">
                  {brazil.history.author.role}
                </span>
              </div>
            </div>
          </Reveal>

          <div className="grid content-start gap-[clamp(16px,1.5vw,20px)]">
            {brazil.metrics.map((metric, i) => (
              <Reveal
                key={metric.value}
                as="article"
                replay
                delay={0.34 + i * 0.2}
                className="flex flex-col gap-[clamp(16px,2.1vw,40px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-night p-[clamp(24px,2.6vw,50px)]"
              >
                <div className="flex items-center gap-[clamp(12px,2vw,40px)]">
                  <p className="font-display text-[clamp(34px,3.35vw,64px)] leading-none font-semibold tracking-[-0.02em] text-offwhite">
                    {metric.value}
                  </p>
                  <span className="rounded-lg bg-lime px-4 py-[clamp(7px,0.55vw,10px)] text-micro leading-[1.2] tracking-[0.15em] text-night">
                    {metric.label}
                  </span>
                </div>
                <p className="leading-[1.5] font-light text-offwhite">{metric.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
