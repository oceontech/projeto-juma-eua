/**
 * Prepara os recortes (PNG com fundo transparente) da seção de culturas da LP
 * do Aminosan: apara a margem vazia, encaixa em 720 × 960 (3:4, ancorado no
 * pé — o CSS do card alinha embaixo à esquerda) e grava em webp com alfa em
 * public/img/aminosan-b/cut-<nome>.webp.
 *
 *   node scripts/cut-webp.mjs strawberry.png tomato.png citrus.png
 *   node scripts/cut-webp.mjs ~/Downloads/morango.png --name strawberry
 *   node scripts/cut-webp.mjs a.png --out ./tmp        (para testar sem gravar no site)
 *   node scripts/cut-webp.mjs a.png --quality 84       (se passar de 170 KB)
 *
 * O nome do arquivo de saída vem do nome do PNG (sem "cut-" na frente); com
 * `--name` ele é forçado (só vale para um arquivo por vez).
 *
 * Por que 720 × 960: o recorte aparece com no máximo ~360 px de altura no
 * desktop (`.ss-cut` em Season.tsx), então 720 de altura já cobre tela 2×. Os
 * recortes antigos eram 1045 × 1400 (150–330 KB) — bem mais do que qualquer
 * tela mostra. Qualidade 88 (a cor do fruto e da folha é o que se vê; abaixo
 * disso a raiz fina e a nervura empastam) e alfa a 70, que o contorno não
 * pede mais: com esse par o recorte denso fica em ~150 KB.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const W = 720;
const H = 960;
const BUDGET_KB = 170;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function flag(name) {
  const i = args.indexOf(name);
  if (i === -1) return null;
  const [, value] = args.splice(i, 2);
  return value ?? null;
}

const outDir = path.resolve(flag("--out") ?? path.join(root, "public/img/aminosan-b"));
const forced = flag("--name");
const quality = Number(flag("--quality") ?? 88);
const inputs = args;

if (inputs.length === 0 || (forced && inputs.length > 1)) {
  console.error("uso: node scripts/cut-webp.mjs <arquivo.png> [...] [--name x] [--out pasta]");
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

for (const input of inputs) {
  const meta = await sharp(input).metadata();
  if (!meta.hasAlpha) {
    console.warn(`! ${input}: sem canal alfa. O recorte precisa de fundo transparente — remova o fundo antes.`);
  }

  const name = forced ?? path.basename(input, path.extname(input)).replace(/^cut-/, "");
  const target = path.join(outDir, `cut-${name}.webp`);

  const info = await sharp(input)
    .ensureAlpha()
    .trim({ threshold: 8 })
    .resize(W, H, { fit: "contain", position: "south", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality, alphaQuality: 70, effort: 6, smartSubsample: true })
    .toFile(target);

  const kb = Math.round(info.size / 1024);
  const flagged = kb > BUDGET_KB ? `  ← acima de ${BUDGET_KB} KB` : "";
  console.log(`${path.relative(process.cwd(), target)}  ${info.width}×${info.height}  ${kb} KB${flagged}`);
  await stat(target);
}
