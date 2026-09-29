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

export async function getUsSettings(): Promise<UsSettings> {
  return (await panel<UsSettings>("/api/globals/settings-us?depth=0", "settings")) ?? {};
}

export const addressLines = (s: UsSettings, fallback: string[]) => {
  const lines = (s.address ?? "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : fallback;
};

export const socialLinks = (s: UsSettings) =>
  (Object.entries(s.social ?? {}) as [SocialKey, string | null | undefined][])
    .filter(([, href]) => href && /^https?:\/\//.test(href))
    .map(([key, href]) => ({ key, href: href! }));

type Media = { url?: string | null; alt?: string | null; width?: number | null; height?: number | null } | null;

export type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  date: string;
  author?: string | null;
  category?: string | null;
  cover?: Media | number;
  bodyHtml?: string | null;
};

export const CATEGORY_LABEL: Record<string, string> = {
  "field-notes": "Field notes",
  "crop-nutrition": "Crop nutrition",
  trials: "Trials",
  company: "Company",
};

const FIELDS = "select[title]=true&select[slug]=true&select[excerpt]=true&select[date]=true&select[author]=true&select[category]=true&select[cover]=true";

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
