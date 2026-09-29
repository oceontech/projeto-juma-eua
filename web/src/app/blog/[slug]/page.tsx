import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LABEL, formatDate, getPost, getPosts, mediaUrl } from "@/lib/panel";
import { PostCard } from "../PostCard";
import s from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Blog" };
  const cover = mediaUrl(post.cover);
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { type: "article", title: post.title, description: post.excerpt ?? undefined, images: cover ? [cover] : undefined },
  };
}

/** Post do blog. O texto chega do painel já em HTML (campo bodyHtml). */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cover = mediaUrl(post.cover);
  const more = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className={s.page}>
      <article className={s.article}>
        <Link href="/blog" className={s.back}>
          ← All notes
        </Link>
        {post.category && <p className={s.eyebrow}>{CATEGORY_LABEL[post.category] ?? post.category}</p>}
        <h1 className={s.postTitle}>{post.title}</h1>
        {post.excerpt && <p className={s.postLede}>{post.excerpt}</p>}
        <p className={`${s.meta} ${s.postMeta}`}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.author && <span>By {post.author}</span>}
        </p>
        {cover && (
          <div className={s.postCover}>
            <Image src={cover} alt="" fill priority sizes="(min-width: 800px) 760px, 100vw" />
          </div>
        )}
        {post.bodyHtml && <div className={s.body} dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />}
      </article>

      {more.length > 0 && (
        <section className={`${s.wrap} ${s.related}`}>
          <h2 className={s.relatedTitle}>More notes</h2>
          <ul className={s.grid}>
            {more.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
