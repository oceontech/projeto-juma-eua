import Image from "next/image";
import Link from "next/link";
import { categoryName, formatDate, mediaUrl, type Post } from "@/lib/panel";
import s from "./blog.module.css";

export function PostCard({ post }: { post: Post }) {
  const cover = mediaUrl(post.cover);
  return (
    <Link href={`/blog/${post.slug}`} className={s.card}>
      <span className={s.cover}>
        {cover ? (
          <Image src={cover} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
        ) : (
          <span className={s.coverMark}>Juma-Agro Field Notes</span>
        )}
      </span>
      <span className={s.cardBody}>
        <span className={s.meta}>
          {categoryName(post) && <b>{categoryName(post)}</b>}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.readMinutes ? <span>{post.readMinutes} min read</span> : null}
        </span>
        <h2 className={s.cardTitle}>{post.title}</h2>
        {post.excerpt && <p className={s.excerpt}>{post.excerpt}</p>}
        <span className={s.more}>Read the note →</span>
      </span>
    </Link>
  );
}
