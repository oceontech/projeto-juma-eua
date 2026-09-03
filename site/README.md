# Protótipo de copy — Juma-Agro USA

Protótipo navegável das três páginas, com a copy nos lugares certos e em dois idiomas.
Serve para **validar texto e estrutura**, não para virar o site final.

Contexto do projeto, design system e pendências: veja o [README da raiz](../README.md) e `../docs/`.

## Como abrir

Abra `index.html` (protótipo de copy) ou `home.html` (home desenhada, a partir do Figma) no
navegador — não precisa de build nem instalação.

Para desenvolver, use `python serve.py [porta]`: ele envia `no-store` em tudo, então cada F5 traz a
versão do disco. O `python -m http.server` responde 304 e o navegador mantém o CSS antigo em
memória, o que faz um ajuste de cor parecer que não foi aplicado.

Os três controles (EN/PT, notas de seção, Trilha A/B do KMEP) estão descritos no README da raiz.

## Arquivos

```
site/
├── home.html           Home desenhada — implementação dos layouts do Figma
├── index.html          Home — 9 seções (S0 a S9), protótipo de copy
├── kmep-ultra.html     LP KMEP Ultra — 12 seções (K1 a K12), duas trilhas
├── aminosan.html       LP Aminosan — 12 seções (A1 a A12)
├── assets/css/styles.css   protótipo de copy
├── assets/css/home.css     home desenhada
├── assets/js/app.js        protótipo de copy
├── assets/js/home.js       home desenhada
├── assets/img/             assets exportados do Figma
└── serve.py
```

## A home desenhada (`home.html`)

Implementa os dois frames do Figma — `JUMA WEBSITE - LAYOUT` (1920) e
`JUMA WEBSITE - MOBILE` (440) — como uma página só, responsiva. É a home **de design**;
`index.html` continua sendo o protótipo de copy bilíngue, intocado.

Frames de origem, no arquivo `OzfLxyCV619VVW4XDgH1ra`:

| Frame | node-id |
|---|---|
| Desktop 1920 | `2318-5259` |
| Mobile 440 | `2747-1769` |

O que é bom saber antes de mexer:

- **Fonte.** O layout usa **Neue Plak**, que é licenciada. O CSS cai em **Archivo**, a grotesk
  livre mais próxima em largura e terminais. Quando a licença entrar, troque só as duas linhas
  `--display` / `--body` no topo de `assets/css/home.css`.
- **O hero é um palco de proporção fixa** (1920 × 2297, a moldura do Figma). Céu, bandeiras,
  trator e plantação são posicionados em porcentagem dentro dele, então escalam juntos e nunca
  se desalinham. Abaixo de 860px o palco sangra para os lados (`width: 168%`), que é o que o
  frame mobile faz para manter o trator grande numa tela estreita.
- **Quatro comportamentos em `home.js`**, sem dependências: menu mobile, comparador
  antes/depois (arraste, e setas do teclado pelo `input[type=range]` escondido), leque de
  culturas (clique na carta ou no ponto) e a entrada das seções no scroll.
- **O formulário não envia nada** — o endpoint entra junto com a stack final.
- Os assets vieram do Figma e estão comitados em `assets/img/`. As URLs de export do Figma
  expiram em 7 dias; não dá para re-baixar depois disso sem reabrir o arquivo.

## Como a copy bilíngue funciona

Os dois idiomas convivem no HTML, um ao lado do outro:

```html
<h1>
  <span data-en>Proven where the growing season never stops.</span>
  <span data-pt>Comprovado onde a safra nunca para.</span>
</h1>
```

O CSS esconde um dos dois conforme o atributo `lang` do `<html>`:

```css
html[lang="en"] [data-pt] { display: none !important; }
html[lang="pt"] [data-en] { display: none !important; }
```

Foi feito assim de propósito: **quem edita vê os dois textos juntos**, sem precisar abrir um arquivo
de tradução à parte. Para alterar uma frase, edite o HTML nos dois `<span>`. Sem JavaScript o site
ainda funciona — fica em inglês.

Quando isto virar Next.js, essa estrutura sai: o conteúdo passa para arquivos TypeScript tipados,
conforme a stack definida em [`../docs/03-SITE.md`](../docs/03-SITE.md).

## O que ainda não é real

Tudo que aparece em área hachurada é **placeholder de asset**, com a legenda dizendo qual material
entra ali e qual pendência o libera. O mesmo vale para os slots de animação (`AN-01` a `AN-08`).

Os campos marcados `[P4]`, `[P8]`, `[P9]` e afins são dados que a Juma ainda não enviou — dose,
preço, testemunha, Guaranteed Analysis. Estão à vista de propósito: some o marcador, some a lacuna
do olhar de quem revisa. O painel completo `P1`–`P32` está em
[`../docs/04-PENDENCIAS.md`](../docs/04-PENDENCIAS.md).

Os formulários não enviam nada. O tipográfico usa Space Grotesk e Montserrat via Google Fonts; sem
internet, cai no fallback do sistema e o layout continua correto.

## Ainda não implementado

- Geolocalização por IP na seção de culturas — o estado aparece fixo em Iowa, como exemplo.
- Mapa dos EUA — está como placeholder; vai ser SVG inline por estado, sem biblioteca.
- Animações — especificadas em `../docs/03-SITE.md`, aqui só reservam o espaço.

## Base

Design system, estrutura das seções, copy e pendências: [`../docs/`](../docs/). A paleta, a escala
tipográfica e o ritmo de inversão claro/escuro estão em `../docs/03-SITE.md` e implementados em
`assets/css/styles.css`.
