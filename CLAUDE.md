# Contexto do projeto

Site da **Juma-Agro Fertilizer LLC** para o mercado americano. Três páginas: Home, LP KMEP Ultra®,
LP Aminosan®. O site fica em `web/` (Next.js). Leia `README.md` para o estado geral e
`web/README.md` antes de escrever animação.

## Onde está a verdade de cada página

| Página | Copy e posicionamento | Implementação |
|---|---|---|
| Home | `docs/03-SITE.md` | `web/src/components/home/` + `web/src/content/home.ts` |
| **LP KMEP Ultra®** | **`docs/05-COPY-KMEP-ULTRA.md`** | `web/src/components/kmep/` + `web/src/content/kmep.ts` — rota `/kmep` (`/kmep-ultra` redireciona) |
| LP KMEP Ultra® versão B do teste A/B (rota `/kmep-b`) | mesmo canônico, headline versão 2 | mesmos componentes com `variant="b"`; cenas de partículas em `web/src/lib/scan/kmep.ts` |
| **LP Aminosan®** (rota `/aminosan`) | `web/src/content/aminosan-b.ts` | `web/src/components/aminosan-b/` — nasceu como versão B e virou a principal |
| LP Aminosan® versão anterior (rota `/aminosan-b`) | `docs/03-SITE.md` + `web/src/content/aminosan.ts` | `web/src/components/aminosan/` |

**Antes de escrever qualquer coisa da LP do KMEP Ultra, leia `docs/05-COPY-KMEP-ULTRA.md`.** Ele é o
documento canônico: posicionamento, arco narrativo, as dezessete seções e a copy pronta em inglês.

`site/` é um **protótipo antigo de copy**, em HTML estático. Serve de referência de blocos de prova
e de FAQ. A copy do KMEP que está lá é a versão anterior, de onze seções, e **não** é o
posicionamento atual.

## Regras que valem para as três páginas

- **Copy em inglês americano.** Conteúdo em arquivos TypeScript tipados em `web/src/content/`, com
  espelho em português em `web/src/content/pt/` para revisão da Juma. Sem CMS.
- **FIFRA.** Descrever o que o produto entrega, nunca o efeito que ele provoca na planta ou no
  inseto. Claim de controle de praga ou de performance de defensivo exige registro na EPA. As
  restrições por seção estão em `docs/02-MERCADO-USA.md` e, para o KMEP, em `docs/05-COPY-KMEP-ULTRA.md`.
- **Nenhum número sem fonte e sem testemunha.** As pendências abertas estão em
  `docs/04-PENDENCIAS.md`, com o que cada uma destrava.
- **Unidades americanas:** `bu/ac`, `fl oz/acre`, estágios V4/V6/VT/R1. Nunca litros nem sc/ha no
  texto corrido.
