import Image from "next/image";
import Link from "next/link";
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

export function PostArticle({ post }: { post: PostView }) {
  return (
    <article className={s.article}>
      <Link href="/blog" className={s.back}>
        ← All notes
      </Link>
      {post.category && <p className={s.eyebrow}>{post.category}</p>}
      <h1 className={s.postTitle}>{post.title}</h1>
      {post.excerpt && <p className={s.postLede}>{post.excerpt}</p>}
      <p className={`${s.meta} ${s.postMeta}`}>
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        {post.readMinutes ? <span>{post.readMinutes} min read</span> : null}
        {post.author && <span>By {post.author}</span>}
      </p>
      {post.cover && (
        <div className={s.postCover}>
          <Image src={post.cover} alt="" fill priority sizes="(min-width: 800px) 760px, 100vw" />
        </div>
      )}
      {post.bodyHtml && <div className={s.body} dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />}
    </article>
  );
}
