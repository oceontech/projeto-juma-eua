import { Fragment } from "react";
import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionIntro } from "@/components/ui";
import { programs } from "@/content/home";

const CARD =
  "relative overflow-hidden rounded-[clamp(16px,1.55vw,30px)] bg-linear-[149.8deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(24px,2.2vw,42px)] text-white";

/** As três frentes que rodam o ano todo: pesquisa, portas abertas e time. */
export function Programs() {
  const [desata, experience, juma360] = programs.cards;

  return (
    <section id="programs" className="bg-white py-sec">
      <div className="wrap">
        <Reveal className="mb-[clamp(28px,3vw,60px)]">
          <SectionIntro aside={<p className="text-muted">{programs.body}</p>}>
            <h2 className="text-h2 leading-[0.967] text-ink">
              {programs.headline.map((line, i) => (
                <Fragment key={line}>
                  {i > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h2>
          </SectionIntro>
        </Reveal>

        <div className="grid gap-[clamp(16px,1.6vw,28px)]">
          <Reveal
            as="article"
            className={`${CARD} flex flex-col items-start gap-[clamp(18px,1.65vw,31px)] min-[861px]:flex-row min-[861px]:items-center`}
          >
            <div
              aria-hidden
              className="relative aspect-square w-[clamp(150px,13.5vw,260px)] shrink-0 overflow-hidden"
            >
              <Image
                src="/img/orbit.svg"
                alt=""
                width={359}
                height={359}
                className="absolute -top-[19.25%] -left-[42.5%] w-[138.5%] max-w-none"
              />
            </div>
            <ProgramBody program={desata} />
          </Reveal>

          <div className="grid grid-cols-1 gap-[clamp(16px,1.6vw,31px)] min-[861px]:grid-cols-2">
            <Reveal as="article" className={CARD}>
              <ProgramBody program={experience} />
            </Reveal>

            <Reveal as="article" delay={0.08} className={CARD}>
              <Image
                src="/img/globe.svg"
                alt=""
                aria-hidden
                width={407}
                height={407}
                className="pointer-events-none absolute -top-[4%] -right-[24%] w-[61%] opacity-60 max-[860px]:top-auto max-[860px]:-right-[30%] max-[860px]:-bottom-[10%] max-[860px]:w-[82%]"
              />
              <ProgramBody program={juma360} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramBody({ program }: { program: (typeof programs.cards)[number] }) {
  return (
    <div className="relative flex min-w-0 flex-1 flex-col gap-[clamp(14px,1.55vw,30px)]">
      <p className="font-display text-[clamp(10px,0.82vw,16px)] tracking-[0.1em] text-lime-bright uppercase">
        {program.eyebrow}
      </p>

      <h3 className="text-h3 font-semibold">{program.title}</h3>

      <p className="text-small leading-[1.56] text-muted-dark">{program.body}</p>

      {program.tags && (
        <div className="flex flex-wrap gap-[13px]">
          {program.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border-[1.3px] border-line-night px-[1em] py-[0.5em] font-tag text-[clamp(12px,1.24vw,23.5px)] leading-[1.5]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {program.closing && (
        <p className="font-display text-[clamp(10px,0.82vw,16px)] leading-[1.46] text-lime-bright uppercase">
          {program.closing.map((line, i) => (
            <Fragment key={line}>
              {i > 0 && <br />}
              {line}
            </Fragment>
          ))}
        </p>
      )}

      {program.note && (
        <p className="font-display text-[clamp(10px,0.82vw,16px)] tracking-[0.02em] text-muted-dark uppercase">
          {program.note}
        </p>
      )}
    </div>
  );
}
