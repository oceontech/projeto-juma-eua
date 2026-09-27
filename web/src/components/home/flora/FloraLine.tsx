import { useId } from "react";
import { at, inset, loop, quietHalf, r2, rng } from "./shared";
import { bond, scatter } from "./geometry";

/*
 * A flora dos produtos, em linha fina. Cada produto tem uma composição só, a
 * mesma nas duas bordas da faixa, e ela é moldura, não assunto: espaçada, de
 * traço leve, e o que ela desenha é o que o produto entrega.
 *
 *   KMEP Ultra®  a calda. Em cima as gotas caem até a faixa e abrem uma onda
 *                quando tocam nela; embaixo saem da faixa e caem para longe.
 *                As maiores levam o K⁺ — é o potássio indo na passada.
 *   Aminosan®    aminoácidos livres, cada um solto, à deriva nos dois lados
 *                da faixa — "free-form", desenhado. A cadeia lateral muda de
 *                um para outro, como muda entre os aminoácidos de verdade.
 *
 * Nada aqui mostra efeito na planta nem no inseto (FIFRA,
 * docs/02-MERCADO-USA.md).
 */

type Band = { w: number; h: number };
type Edge = "top" | "bottom";

/* ------------------------------------------------------------ o aminoácido */

type Chain = 0 | 1 | 2;

/**
 * Aminoácido em bola e vareta: o carbono alfa no meio, o grupo amino (o
 * nitrogênio, na cor acesa), a carboxila com o oxigênio de ligação dupla e a
 * cadeia lateral. A parte tracejada é a que muda de um aminoácido para outro:
 * sozinha (`chain` 0), depois de um carbono (1) ou ramificada (2).
 */
function AminoGlyph({ s = 1, chain = 0 }: { s?: number; chain?: Chain }) {
  const A = (x: number, y: number, r: number) => ({ x: x * s, y: y * s, r: r * s });
  const ca = A(0, 0, 4.4);
  const n = A(-17, -9, 5.4);
  const c = A(16, -7, 4.4);
  const o1 = A(23, -21, 4.4);
  const o2 = A(30, 1, 4.4);
  const cb = A(-2, 18, 4.4);
  const tips =
    chain === 0 ? [A(-2, 18, 5.6)] : chain === 1 ? [A(-13, 31, 5.2)] : [A(-15, 28, 4.8), A(10, 30, 4.8)];
  const skeleton = [bond(ca, n), bond(ca, c), bond(c, o2)];
  if (chain === 0) skeleton.push(bond(ca, tips[0]));
  else skeleton.push(bond(ca, cb), ...tips.map((t) => bond(cb, t)));

  return (
    <>
      <path className="fl-bond" d={skeleton.join("")} />
      <path className="fl-bond" d={bond(c, o1, 1.7 * s) + bond(c, o1, -1.7 * s)} />
      <circle className="fl-atom fl-atom--n" cx={r2(n.x)} cy={r2(n.y)} r={r2(n.r)} />
      <circle className="fl-atom" cx={r2(ca.x)} cy={r2(ca.y)} r={r2(ca.r)} />
      <circle className="fl-atom" cx={r2(c.x)} cy={r2(c.y)} r={r2(c.r)} />
      <circle className="fl-atom fl-atom--o" cx={r2(o1.x)} cy={r2(o1.y)} r={r2(o1.r)} />
      <circle className="fl-atom fl-atom--o" cx={r2(o2.x)} cy={r2(o2.y)} r={r2(o2.r)} />
      {chain > 0 && <circle className="fl-atom" cx={r2(cb.x)} cy={r2(cb.y)} r={r2(cb.r)} />}
      {tips.map((t, i) => (
        <circle key={i} className="fl-atom fl-atom--r" cx={r2(t.x)} cy={r2(t.y)} r={r2(t.r)} />
      ))}
    </>
  );
}

/**
 * Os aminoácidos à deriva. Desenhados para a borda de cima — o vão do pack
 * fica junto da faixa, no pé da caixa — e espelhados na de baixo, onde o
 * mesmo vão protege o botão.
 *
 * Três movimentos sobrepostos, cada um no seu período, para nenhum deles se
 * ler como laço: a flutuação (sobe, desce e gira um pouco), a deriva lateral,
 * mais lenta, e — só na entrada — o aparecimento. Os de perto (maiores) andam
 * mais que os de longe: é o que dá profundidade sem desfoque.
 */
function AminoField({ w, h, seed }: Band & { seed: number }) {
  const rand = rng(seed);
  const q = quietHalf(w);
  const spots = scatter(
    Math.round(w / 150),
    92,
    (x, y) => !(Math.abs(x - w / 2) < q && y > h - 150),
    () => ({ x: 30 + rand() * (w - 60), y: h * (0.16 + rand() * 0.7) }),
    60,
  );
  const mist = scatter(Math.round(w / 9), 9, () => true, () => ({ x: rand() * w, y: h * (0.06 + rand() * 0.9) }));

  return (
    <>
      {mist.map((p, i) => (
        <g key={i} className="fl fl-fade" style={at(0.04 + (p.x / w) * 0.3, 0.2)}>
          <circle
            className={i % 4 === 0 ? "fl-mist fl-twinkle" : "fl-mist"}
            style={loop(0, 1, 3 + (i % 5) * 0.9, i * 0.7)}
            cx={r2(p.x)}
            cy={r2(p.y)}
            r={r2(0.6 + ((i * 7) % 10) / 10)}
          />
        </g>
      ))}
      {spots.map((p, i) => {
        /* Profundidade: as de cima são menores e mais apagadas. */
        const depth = (p.y / h) * 0.6 + rand() * 0.4;
        const s = 0.72 + depth * 0.62;
        const rot = -40 + rand() * 80;
        const pick = rand();
        const chain: Chain = pick < 0.5 ? 0 : pick < 0.8 ? 1 : 2;
        return (
          <g key={i} className="fl fl-pop" style={at(0.12 + (p.x / w) * 0.4, 0.14)}>
            <g
              className="fl-drift"
              style={loop(0, 1, 13 + (i % 6) * 1.7, i * 2.3, { "--dx": `${r2(6 + depth * 14)}px` })}
            >
              <g
                className="fl-float"
                transform={`translate(${r2(p.x)} ${r2(p.y)})`}
                style={{
                  ...loop(0, 1, 5.5 + (i % 5) * 1.3, i * 1.1, {
                    "--fy": `${r2(4 + depth * 7)}px`,
                    "--fr": `${r2(7 + (i % 3) * 3 + depth * 4)}deg`,
                  }),
                  transformOrigin: `${r2(p.x)}px ${r2(p.y)}px`,
                }}
              >
                <g transform={`rotate(${r2(rot)})`} opacity={r2(0.55 + depth * 0.45)}>
                  <AminoGlyph s={s} chain={chain} />
                </g>
              </g>
            </g>
          </g>
        );
      })}
    </>
  );
}

/* --------------------------------------------------------------- a calda */

/** Gota caindo: redonda embaixo, afinando para cima, com o centro do corpo em (0,0). */
function dropPath(r: number) {
  return `M0 ${r2(-r * 2.1)}C${r2(r * 0.55)} ${r2(-r * 1.25)} ${r2(r)} ${r2(-r * 0.62)} ${r2(r)} 0A${r2(r)} ${r2(r)} 0 0 1 ${r2(-r)} 0C${r2(-r)} ${r2(-r * 0.62)} ${r2(-r * 0.55)} ${r2(-r * 1.25)} 0 ${r2(-r * 2.1)}Z`;
}

/**
 * As gotas. Na borda de cima caem de fora da caixa até a faixa e, ao tocar,
 * abrem duas ondas, uma logo atrás da outra; na de baixo nascem atrás da
 * faixa e caem para longe dela, sumindo no degradê. Uma em cada três é
 * grande e leva o K⁺.
 *
 * Os tamanhos vêm em três faixas — gota grande, média e respingo — porque
 * calda de verdade não sai em tamanho único, e é a mistura que tira a
 * cara de padrão repetido.
 */
function Rain({ w, h, seed, edge }: Band & { seed: number; edge: Edge }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rand = rng(seed);
  const q = quietHalf(w);
  const m = inset(w);
  const down = edge === "bottom";
  const count = Math.round(w / 64);

  /* Colunas espalhadas por estratos: uma em cada fatia da largura, com
     sorteio dentro dela. Sorteio livre deixava buracos e montes. */
  const drops = Array.from({ length: count }, (_, i) => {
    let x = m + ((i + 0.15 + rand() * 0.7) / count) * (w - 2 * m);
    if (Math.abs(x - w / 2) < q * 0.55) x += (x < w / 2 ? -1 : 1) * q * 0.55;
    const kind = i % 3 === 0 ? "big" : rand() < 0.5 ? "mid" : "fine";
    const r = kind === "big" ? 8.5 + rand() * 1.5 : kind === "mid" ? 4 + rand() * 1.2 : 2.4 + rand() * 0.8;
    /* Gota grande cai mais devagar na tela: está "mais perto". */
    const dur = (down ? 4.2 : 3) + rand() * 1.4 + (kind === "big" ? 0.8 : 0);
    return { x, r, big: kind === "big", dur, delay: rand() * dur, tail: 10 + rand() * 14 + r * 1.4 };
  }).sort((a, b) => a.r - b.r);

  return (
    <>
      <defs>
        <linearGradient id={`${id}t`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "rgb(var(--flora-lit))", stopOpacity: 0 }} />
          <stop offset="1" style={{ stopColor: "rgb(var(--flora-lit))", stopOpacity: 0.38 }} />
        </linearGradient>
      </defs>
      {drops.map((d, i) => {
        const y0 = down ? -d.r : -d.r * 2.4;
        const dy = down ? h * 0.82 : h - y0 - d.r - 2;
        const top = -d.r * 2.1;
        const timing = loop(0, 1, d.dur, d.delay);
        return (
          <g key={i} className="fl fl-fade" style={at(0.2 + (d.x / w) * 0.4, 0.14)}>
            <g
              className="fl-rain"
              transform={`translate(${r2(d.x)} ${r2(y0)})`}
              style={{ ...timing, "--dy": `${r2(dy)}px` } as React.CSSProperties}
            >
              {/* O rastro: afina até sumir, e é o que diz que a gota está caindo. */}
              <path
                d={`M-0.5 ${r2(top - d.tail)}H0.5L${r2(d.r * 0.34)} ${r2(top + d.r * 0.4)}H${r2(-d.r * 0.34)}Z`}
                fill={`url(#${id}t)`}
              />
              <path className="fl-drop" d={dropPath(d.r)} />
              <path
                className="fl-shine"
                d={`M${r2(-d.r * 0.62)} ${r2(d.r * 0.02)}A${r2(d.r * 0.64)} ${r2(d.r * 0.64)} 0 0 0 ${r2(-d.r * 0.08)} ${r2(d.r * 0.6)}`}
              />
              {d.big && (
                <>
                  <text className="fl-ion-k" x={r2(-d.r * 0.08)} y={r2(d.r * 0.36)} textAnchor="middle" fontSize={r2(d.r * 1.02)}>
                    K
                  </text>
                  <text className="fl-ion-k" x={r2(d.r * 0.4)} y={r2(-d.r * 0.2)} fontSize={r2(d.r * 0.62)}>
                    +
                  </text>
                </>
              )}
            </g>
            {!down && (
              <>
                <ellipse
                  className="fl-ripple"
                  cx={r2(d.x)}
                  cy={r2(h - 3)}
                  rx={r2(9 + d.r * 2.4)}
                  ry={r2(2.2 + d.r * 0.5)}
                  style={timing}
                />
                <ellipse
                  className="fl-ripple fl-ripple--late"
                  cx={r2(d.x)}
                  cy={r2(h - 3)}
                  rx={r2(6 + d.r * 1.6)}
                  ry={r2(1.6 + d.r * 0.34)}
                  style={timing}
                />
              </>
            )}
          </g>
        );
      })}
    </>
  );
}

/** Espelho vertical da caixa: o que foi desenhado para cima, pendendo para baixo. */
function Mirror({ h, children }: { h: number; children: React.ReactNode }) {
  return <g transform={`translate(0 ${h}) scale(1 -1)`}>{children}</g>;
}

export function FloraLine({ product, edge, w, h }: Band & { product: "kmep" | "aminosan"; edge: Edge }) {
  if (product === "kmep") return <Rain w={w} h={h} edge={edge} seed={edge === "top" ? 49 : 29} />;
  /* A semente muda entre as bordas para o espelho não sair idêntico. */
  if (edge === "top") return <AminoField w={w} h={h} seed={41} />;
  return (
    <Mirror h={h}>
      <AminoField w={w} h={h} seed={43} />
    </Mirror>
  );
}
