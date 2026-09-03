# Juma-Agro USA

Site institucional e comercial da **Juma-Agro Fertilizer LLC** para o mercado americano.

| Campo | Valor |
|---|---|
| Cliente | Juma Agro Indústria e Comércio Ltda · Juma-Agro Fertilizer LLC |
| Executor | Oceon Desenvolvimento Digital |
| Escopo v1 | 3 páginas — Home USA · LP KMEP Ultra · LP Aminosan |
| Idioma | Inglês americano (en-US). Espanhol fora da v1 |
| Entrega prevista | 30/08/2026 |
| Interlocutores na Juma | Rodrigo Henrique Moraes (Coord. Comunicação) · Debora Macias (Marketing) |
| Time Oceon | Gustavo (gestão, copy EN) · Pedro (design/Figma) · Davi (Next.js, deploy) |

---

## Estado atual

O repositório tem duas pastas de código, com papéis diferentes.

### `web/` — o site

Next.js 16 (App Router) + TypeScript + Tailwind v4 + **GSAP**, a stack do PRD. É onde o trabalho
acontece daqui para a frente. A **home está pronta**, implementada a partir dos dois frames do
Figma; as duas LPs são rotas de esqueleto esperando o layout.

```
cd web && npm install && npm run dev
```

Como escrever animação sem vazar ScrollTrigger, onde ficam os tokens e o que ainda falta:
[`web/README.md`](web/README.md). **Leia antes de animar** — há três regras que não são óbvias.

### `site/` — o protótipo de copy

HTML estático, sem build. Serve para **validar texto**, não é o site final:

- `site/index.html` — as três páginas, bilíngue EN/PT lado a lado, com notas de seção e marcadores
  de pendência à vista.
- `site/home.html` — a home desenhada em HTML puro, primeira implementação dos frames do Figma.
  Continua valendo como referência visual e como prova de que o layout fecha sem framework.

A copy das duas LPs vive aqui até elas serem portadas.

---

## Os documentos

Quatro arquivos, cada um respondendo uma pergunta distinta. Leia nesta ordem.

| Documento | Responde |
|---|---|
| [`docs/01-PRODUTO.md`](docs/01-PRODUTO.md) | O que a empresa é e o que ela vende. Ensaios com fonte e testemunha |
| [`docs/02-MERCADO-USA.md`](docs/02-MERCADO-USA.md) | O que o mercado americano impõe: posicionamento, FIFRA, culturas, canal |
| [`docs/03-SITE.md`](docs/03-SITE.md) | O que o site precisa ser: escopo, páginas seção a seção, design system, stack |
| [`docs/04-PENDENCIAS.md`](docs/04-PENDENCIAS.md) | O que falta a Juma responder, por urgência, e o que cada resposta destrava |

A direção visual original (`Editorial.pdf`) e os wireframes v1 já estão absorvidos no design system
de `03-SITE.md` e implementados em `site/assets/css/styles.css`. Se precisar dos originais, estão no
histórico do git.

---

## Como rodar

### O site (`web/`)

```
cd web
npm install
npm run dev            # http://localhost:3000
```

### O protótipo de copy (`site/`)

Abra `site/index.html` no navegador. Não precisa de build nem instalação.

Para desenvolver, use o servidor sem cache — o `http.server` padrão responde 304 e o navegador
mantém o CSS antigo, o que faz um ajuste de cor parecer que não foi aplicado:

```
cd site
python serve.py        # http://localhost:8080/index.html
```

### Os três controles do protótipo

| Onde | Controle | O que faz |
|---|---|---|
| Navbar | **EN / PT** | Troca o idioma. EN é a copy real; PT é a tradução comentada para o time |
| Canto inferior direito | **Notas de seção** | Etiquetas com o ID do bloco (`S1`, `K4`, `A9`…), função e pendências que o travam |
| Canto inferior direito, só no KMEP | **Trilha A / B** | Alterna os blocos de mecanismo entre a versão nutricional e a com claim de praga (HOLD) |

Nas LPs, a **barra de cultura** abaixo do hero troca janela de aplicação, dose e blocos ao longo
da página inteira.

A copy bilíngue convive no mesmo HTML (`<span data-en>` / `<span data-pt>`), escondida por CSS via
o atributo `lang`. Foi feito assim para quem edita ver os dois textos juntos. Quando virar Next.js,
essa estrutura sai e o conteúdo passa para arquivos TypeScript tipados.

---

## As três regras que não se negociam

1. **Todo número anda com a testemunha ao lado.** `221.3 vs 212.3 bu/ac`, nunca `+8.9` sozinho.
2. **Toda fonte é impressa embaixo**, em mono, com local e ano.
3. **Dado brasileiro é identificado como brasileiro.** Esconder a origem destrói mais credibilidade
   do que a origem custa.

E uma quarta, regulatória: **nada vai ao ar sem passar pelo responsável regulatório da LLC** —
inclusive as seções marcadas como livres. A marcação nestes documentos é análise da Oceon a partir
de pesquisa pública. Quem decide onde fica a linha é quem responde pela FIFRA na Juma.
