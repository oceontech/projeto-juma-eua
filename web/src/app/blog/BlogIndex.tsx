"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { PostCard, PostMeta, type CardView } from "./PostCard";
import s from "./blog.module.css";

/**
 * Corpo da lista do blog: o post mais recente em destaque e, abaixo, os
 * outros em grade, com filtro por assunto (categoria do painel).
 */
export function BlogIndex({ posts }: { posts: CardView[] }) {
  const topics = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of posts) if (p.category) count.set(p.category, (count.get(p.category) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
  }, [posts]);
  const [topic, setTopic] = useState<string | null>(null);

  const [featured, ...rest] = posts;
  const list = topic ? posts.filter((p) => p.category === topic) : rest;

  if (!featured) {
    return (
      <div className={s.emptyBox}>
        <b>The first notes are on their way.</b>
        <span>We are writing up what we learn in the field. Check back soon.</span>
      </div>
    );
  }

  return (
    <>
      {!topic && (
        <Link href={`/blog/${featured.slug}`} className={s.featured}>
          <span className={s.featuredCover}>
            {featured.cover ? (
              <Image src={featured.cover} alt="" fill priority sizes="(min-width: 1100px) 58vw, 100vw" />
            ) : (
              <span className={s.cardCoverEmpty} aria-hidden />
            )}
            <span className={s.featuredTag}>Latest note</span>
          </span>
          <span className={s.featuredBody}>
            <PostMeta post={featured} />
            <span className={s.featuredTitle}>{featured.title}</span>
            {featured.excerpt && <span className={s.featuredExcerpt}>{featured.excerpt}</span>}
            <span className={s.btnDark}>
              Read the note
              <span className={s.btnDot} aria-hidden>
                →
              </span>
            </span>
          </span>
        </Link>
      )}

      <div className={s.listHead}>
        <h2 className={s.listTitle}>{topic ?? "More notes"}</h2>
        {topics.length > 1 && (
          <div className={s.topics} role="tablist" aria-label="Filter by topic">
            <button type="button" role="tab" aria-selected={!topic} className={s.topic} onClick={() => setTopic(null)}>
              All
            </button>
            {topics.map((t) => (
              <button key={t} type="button" role="tab" aria-selected={topic === t} className={s.topic} onClick={() => setTopic(t)}>
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {list.length ? (
        <ul className={s.grid}>
          {list.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.muted}>No other notes on this topic yet.</p>
      )}
    </>
  );
}
