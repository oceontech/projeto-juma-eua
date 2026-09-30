import Image from "next/image";
import Link from "next/link";
import s from "./blog.module.css";

/** Card de post já pronto para desenhar (serve à lista, ao filtro e ao "Keep reading"). */
export type CardView = {
  slug: string;
  title: string;
  excerpt?: string | null;
  date: string;
  category?: string | null;
  readMinutes?: number | null;
  cover?: string | null;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" });

export function PostMeta({ post, light }: { post: Pick<CardView, "category" | "date" | "readMinutes">; light?: boolean }) {
  return (
    <span className={light ? `${s.meta} ${s.metaLight}` : s.meta}>
      {post.category && <b>{post.category}</b>}
      <time dateTime={post.date}>{shortDate(post.date)}</time>
      {post.readMinutes ? <span>{post.readMinutes} min read</span> : null}
    </span>
  );
}

export function PostCard({ post }: { post: CardView }) {
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      <span className={s.cardCover}>
        {post.cover ? (
          <Image src={post.cover} alt="" fill sizes="(min-width: 1100px) 30vw, (min-width: 640px) 45vw, 100vw" />
        ) : (
          <span className={s.cardCoverEmpty} aria-hidden />
        )}
      </span>
      <PostMeta post={post} />
      <span className={s.cardTitle}>{post.title}</span>
      {post.excerpt && <span className={s.cardExcerpt}>{post.excerpt}</span>}
      <span className={s.cardMore}>
        Read the note <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
