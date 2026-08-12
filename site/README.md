# Protótipo de copy — Juma-Agro USA

Protótipo navegável das três páginas, com a copy nos lugares certos e em dois idiomas.
Serve para **validar texto e estrutura**, não para virar o site final.

## Como abrir

Abra `index.html` no navegador. Não precisa de servidor, build nem instalação.

Se preferir servir por HTTP (recomendado para testar em celular na mesma rede):

```
cd site
python -m http.server 8080
```

## Os três controles

| Onde | Controle | O que faz |
|---|---|---|
| Navbar | **EN / PT** | Troca o idioma. EN é a copy real que vai ao ar; PT é a tradução comentada para o time entender o que cada seção diz. A escolha fica salva e acompanha a navegação entre páginas. |
| Canto inferior direito | **Notas de seção** | Liga as etiquetas amarelas que mostram, em cada bloco: o identificador (`S1`, `K4`, `A9`…), a função da seção, o status regulatório e as pendências que a travam. É a ponte entre o protótipo e o `Juma-Agro-USA-Estrutura-e-Copy.docx`. |
| Canto inferior direito, só na LP do KMEP | **Trilha A / B** | Alterna os três blocos de mecanismo entre a versão nutricional (publicável) e a versão com claim de praga. A Trilha B aparece com borda vermelha e o aviso HOLD. |

Nas duas páginas de produto há ainda a **barra de cultura** logo abaixo do hero. Ela troca
janela de aplicação, dose e blocos exclusivos ao longo da página inteira.

## Arquivos

```
site/
├── index.html          Home — 9 seções (S0 a S9)
├── kmep-ultra.html     LP KMEP Ultra — 12 seções (K1 a K12), duas trilhas
├── aminosan.html       LP Aminosan — 12 seções (A1 a A12)
├── assets/css/styles.css
├── assets/js/app.js
└── README.md
```

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

Foi feito assim de propósito: **quem edita vê os dois textos juntos**, sem precisar
abrir um arquivo de tradução à parte. Para alterar uma frase, edite o HTML nos dois
`<span>` e pronto. Sem JavaScript o site ainda funciona — fica em inglês.

Quando isto virar Next.js, essa estrutura sai: o conteúdo passa para arquivos TypeScript
tipados, conforme o PRD §8.2. O protótipo não pretende antecipar essa arquitetura.

## Base

- **Cores e direção visual:** `Editorial.pdf` — verde profundo `#004C26` como base, lima
  `#B7C73E` apenas para foco e ação, areia e off-white como respiro.
- **Estrutura das seções:** `Wireframes v1.svg` — a ordem dos blocos, o padrão de cabeçalho
  de seção (título à esquerda, apoio à direita) e o ritmo modular vêm de lá.
- **Copy e notas:** `Juma-Agro-USA-Estrutura-e-Copy.docx`.
- **Pendências (P1 a P30):** painel da Parte V do `Juma-Agro-USA-Documento-Mestre.docx`.

## O que ainda não é real

Tudo que aparece em área hachurada é **placeholder de asset**, com a legenda dizendo qual
material entra ali e qual pendência o libera. O mesmo vale para os slots de animação
(`AN-01` a `AN-08`).

Os campos marcados `[P4]`, `[P8]`, `[P9]` e afins são dados que a Juma ainda não enviou —
dose, preço, testemunha, Guaranteed Analysis. Estão à vista de propósito: some o marcador,
some a lacuna do olhar de quem revisa.

Os formulários não enviam nada. O tipográfico usa Space Grotesk e Montserrat via Google
Fonts; sem internet, cai no fallback do sistema e o layout continua correto.

## Ainda não implementado

- Geolocalização por IP na seção de culturas — o estado aparece fixo em Iowa, como exemplo.
- Mapa dos EUA — está como placeholder; vai ser SVG inline por estado, sem biblioteca.
- Animações — especificadas no documento de copy, aqui só reservam o espaço.
