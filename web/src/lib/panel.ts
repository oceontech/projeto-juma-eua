/**
 * Dados que vêm do painel central (juma-agro.com.br/admin): blog e contato.
 * O resto do site continua em src/content/. Cache de 5 minutos; o painel
 * também avisa na hora que publica (POST /api/revalidate).
 * Se o painel não responder, o site segue com o conteúdo fixo.
 */

const PANEL = (process.env.PANEL_URL ?? "https://juma-agro.com.br").replace(/\/$/, "");
const REVALIDATE = 300;

async function panel<T>(path: string, tag: string): Promise<T | null> {
  try {
    const res = await fetch(`${PANEL}${path}`, {
      next: { revalidate: REVALIDATE, tags: [tag] },
      signal: AbortSignal.timeout(6000),
    });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export type SocialKey = "instagram" | "facebook" | "linkedin" | "youtube" | "x";

export type UsSettings = {
  email?: string | null;
  phone?: string | null;
  hours?: string | null;
  company?: string | null;
  address?: string | null;
  social?: Partial<Record<SocialKey, string | null>> | null;
};

/** Contato (Site EUA › Contato) e redes (Site EUA › Redes sociais) juntos. */
export async function getUsSettings(): Promise<UsSettings> {
  const [contact, social] = await Promise.all([
    panel<UsSettings>("/api/globals/settings-us?depth=0", "settings"),
    panel<Partial<Record<SocialKey, string | null>>>("/api/globals/redes-us?depth=0", "settings"),
  ]);
  return { ...(contact ?? {}), social: social ?? {} };
}

export const addressLines = (s: UsSettings, fallback: string[]) => {
  const lines = (s.address ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
};

const SOCIAL_KEYS: SocialKey[] = ["instagram", "facebook", "linkedin", "youtube", "x"];

export const socialLinks = (s: UsSettings) =>
  SOCIAL_KEYS.map((key) => ({ key, href: s.social?.[key] ?? "" })).filter(({ href }) => /^https?:\/\//.test(href));

type Media = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | null;

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  date: string;
  author?: string | null;
  /** Categoria do painel (Blog › Categoria), populada com depth=1. */
  tema?: { nome?: string | null; slug?: string | null } | number | null;
  readMinutes?: number | null;
  cover?: Media | number;
  bodyHtml?: string | null;
};

export const categoryName = (post: Pick<Post, "tema">) =>
  typeof post.tema === "object" && post.tema ? (post.tema.nome ?? null) : null;

const FIELDS = "select[title]=true&select[slug]=true&select[excerpt]=true&select[date]=true&select[author]=true&select[tema]=true&select[readMinutes]=true&select[cover]=true";

export async function getPosts(): Promise<Post[]> {
  const data = await panel<{ docs: Post[] }>(
    `/api/posts-us?where[_status][equals]=published&sort=-date&limit=100&depth=1&${FIELDS}`,
    "blog",
  );
  return data?.docs ?? [];
}

export async function getPost(slug: string): Promise<Post | null> {
  const data = await panel<{ docs: Post[] }>(
    `/api/posts-us?where[slug][equals]=${encodeURIComponent(slug)}&where[_status][equals]=published&limit=1&depth=1`,
    "blog",
  );
  return data?.docs?.[0] ?? null;
}

/** URL absoluta de uma mídia do painel (o Blob já vem absoluto). */
export function mediaUrl(media: Post["cover"]): string | null {
  if (!media || typeof media !== "object" || !media.url) return null;
  return media.url.startsWith("http") ? media.url : `${PANEL}${media.url}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
