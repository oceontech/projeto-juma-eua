import Image from "next/image";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitLines } from "@/components/motion/SplitLines";
import { brazil } from "@/content/home";

/**
 * O bloco que assume a origem brasileira em vez de esconder — regra do
 * projeto: dado brasileiro é identificado como brasileiro.
 *
 * Server Component: não tem interação própria. O movimento inteiro mora em
 * filhos de cliente (<SplitLines>, <Reveal>, <Counter>), o que mantém a
 * marcação e a cópia renderizadas no servidor.
 */
/**
 * Gatilho comum a todos os blocos desta seção.
 *
 * Ela é puxada para dentro do hero por uma margem negativa, então a posição de
 * layout de cada bloco não diz nada sobre quando ele fica visível: medindo por
 * conta própria, título e coluna da esquerda terminavam a entrada com a seção
 * ainda apagada, e reapareciam prontos junto com ela. Ancorando tudo na seção,
 * a entrada começa quando a lâmina preta acabou de fechar, e a ordem passa a
 * ser a dos `delay`.
 *
 * `replay` porque quem sobe e desce a travessia passa por aqui muitas vezes.
 */
const enter = { replay: true, trigger: "#brazil", start: "top 40%" } as const;

export function BrazilAdvantage() {
  return (
    // `overflow-x: clip` porque os cards entram deslocados na horizontal e o
    // deslocamento é maior que a calha da página nas larguras apertadas —
    // sem o corte, a caixa da página engorda durante a entrada. `clip`, e não
    // `hidden`: `hidden` num eixo transforma o outro em `auto` e a seção
    // viraria um contêiner de rolagem.
    <section
      id="brazil"
      data-nav-theme="dark"
      className="overflow-x-clip bg-black pb-sec text-offwhite"
    >
      <div className="wrap">
        <SplitLines
          {...enter}
          className="mb-[clamp(34px,3.9vw,62px)] text-center text-h2 leading-[0.967] text-white"
        >
          {brazil.title}
        </SplitLines>

        {/* `items-stretch` é o padrão do grid e é o que faz a coluna da
            direita ter a altura da linha — ou seja, a do card da esquerda. O
            que faltava era a coluna repassar essa altura aos dois cards. */}
        <div className="grid grid-cols-1 gap-[clamp(16px,1.5vw,20px)] min-[861px]:grid-cols-[785fr_555fr]">
          <Reveal
            as="article"
            {...enter}
            delay={0.12}
            x={-44}
            blur={10}
            className="brazil-card group relative flex flex-col gap-[clamp(14px,1.65vw,32px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-linear-[122.93deg,var(--color-night-warm)_2.4%,var(--color-night-deep)_60.23%] p-[clamp(24px,2.6vw,50px)]"
          >
            {/* Vinheta clara no canto superior esquerdo, como no layout. */}
            <span
              aria-hidden
              className="brazil-card__glow pointer-events-none absolute -top-[14%] -left-[6%] h-[40%] w-[34%] bg-[radial-gradient(closest-side,rgba(183,199,62,0.16),transparent)]"
            />

            <span className="relative self-start rounded-lg bg-lime p-2.5 text-[clamp(11px,0.9vw,20px)] leading-none tracking-[0.15em] text-white">
              {brazil.history.badge}
            </span>

            {/* Conta a partir de 1900: são as duas últimas casas que se movem,
                o suficiente para o número ter um pulso sem virar um caça-níquel. */}
            <Counter
              as="p"
              {...enter}
              to={Number(brazil.history.year)}
              from={1900}
              delay={0.3}
              duration={1.6}
              className="relative font-display text-[clamp(45px,6.7vw,128px)] leading-[0.92] tabular-nums text-offwhite"
            />

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

          {/* Duas linhas iguais, e não `content-start`: era ele que deixava os
              cards com a altura do próprio texto e o pé da coluna acima do pé
              do card ao lado. Com `1fr 1fr` os dois dividem a altura da linha,
              e o `justify-between` de cada um empurra o corpo para o pé em vez
              de deixar a sobra num vão morto no meio. */}
          <div className="grid gap-[clamp(16px,1.5vw,20px)] min-[861px]:grid-rows-2">
            {brazil.metrics.map((metric, i) => (
              <Reveal
                key={metric.value}
                as="article"
                {...enter}
                delay={0.3 + i * 0.14}
                x={44}
                blur={10}
                className="brazil-card flex flex-col justify-between gap-[clamp(16px,2.1vw,40px)] overflow-hidden rounded-[clamp(12px,1.05vw,20px)] bg-night p-[clamp(24px,2.6vw,50px)]"
              >
                <div className="flex items-center gap-[clamp(12px,2vw,40px)]">
                  <Counter
                    as="p"
                    {...enter}
                    to={Number(metric.value)}
                    delay={0.5 + i * 0.14}
                    duration={1.1}
                    className="font-display text-[clamp(34px,3.35vw,64px)] leading-none font-semibold tracking-[-0.02em] tabular-nums text-offwhite"
                  />
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
