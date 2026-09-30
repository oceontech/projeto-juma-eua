import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ReadingProgress, Share, Toc } from "./ArticleChrome";
import { withHeadingIds } from "./html";
import s from "./blog.module.css";

/** Post pronto para desenhar: usado pela página do post e pela prévia do painel. */
export type PostView = {
  title: string;
  excerpt?: string | null;
  date: string;
  author?: string | null;
  category?: string | null;
  cover?: string | null;
  bodyHtml?: string | null;
  readMinutes?: number | null;
};

export function formatPostDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "America/New_York" });
}

const initials = (name: string) =>
  name
    .replace(/[^A-Za-z\s-]/g, "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "JA";

/**
 * Página do post: cabeçalho editorial, capa larga, texto em coluna de leitura
 * com índice e compartilhar ao lado, e o aviso de rótulo no fim.
 * `after` recebe o "Keep reading" (só na página real, não na prévia).
 */
export function PostArticle({ post, after }: { post: PostView; after?: ReactNode }) {
  const { html, headings } = withHeadingIds(post.bodyHtml ?? "");
  const author = post.author || "Juma-Agro agronomy team";

  return (
    <article className={s.article}>
      <ReadingProgress targetId="post-body" />

      <header className={s.postHead}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/blog">Field notes</Link>
          {post.category && (
            <>
              <span aria-hidden>/</span>
              <span>{post.category}</span>
            </>
          )}
        </nav>
        <h1 className={s.postTitle}>{post.title}</h1>
        {post.excerpt && <p className={s.postLede}>{post.excerpt}</p>}
        <div className={s.byline}>
          <span className={s.avatar} aria-hidden>
            {initials(author)}
          </span>
          <span className={s.bylineText}>
            <b>{author}</b>
            <span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              {post.readMinutes ? <> · {post.readMinutes} min read</> : null}
            </span>
          </span>
          <Share title={post.title} />
        </div>
      </header>

      {post.cover && (
        <div className={s.postCover}>
          <Image src={post.cover} alt="" fill priority sizes="(min-width: 1260px) 1200px, 100vw" />
        </div>
      )}

      <div className={s.postGrid}>
        <aside className={s.postAside}>
          <div className={s.asideSticky}>
            <Toc headings={headings} />
          </div>
        </aside>

        <div id="post-body" className={s.postMain}>
          {html ? <div className={s.body} dangerouslySetInnerHTML={{ __html: html }} /> : <p className={s.muted}>The text of this note goes here.</p>}

          <aside className={s.labelNote}>
            <b>Read the label first.</b> This note is general information. Always follow the directions on the product label and
            talk to your crop adviser about your own fields.
          </aside>

          <div className={s.postFoot}>
            <Link href="/blog" className={s.backLink}>
              <span aria-hidden>←</span> All field notes
            </Link>
            <Share title={post.title} />
          </div>
        </div>
      </div>

      {after}
    </article>
  );
}
