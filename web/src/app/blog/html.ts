/**
 * O texto do post chega do painel em HTML (bodyHtml). Aqui cada intertítulo
 * <h2> ganha um id, para o índice "On this page" e para links diretos.
 */

export type Heading = { id: string; text: string };

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";

export function withHeadingIds(html: string): { html: string; headings: Heading[] } {
  const headings: Heading[] = [];
  const used = new Set<string>();
  const out = html.replace(/<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/g, (_m, attrs: string | undefined, inner: string) => {
    const text = decode(inner);
    let id = slugify(text);
    for (let n = 2; used.has(id); n++) id = `${slugify(text)}-${n}`;
    used.add(id);
    headings.push({ id, text });
    const rest = (attrs ?? "").replace(/\sid="[^"]*"/, "");
    return `<h2 id="${id}"${rest}>${inner}</h2>`;
  });
  return { html: out, headings };
}

/** Texto corrido do HTML (descrição do Google, contagem de palavras). */
export const plainText = (html: string) => decode(html.replace(/<\/(p|h\d|li|blockquote)>/g, " ")).replace(/\s+/g, " ");
