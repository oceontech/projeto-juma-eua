import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryName, getPost, getPosts, mediaUrl } from "@/lib/panel";
import { PostArticle } from "../PostArticle";
import { PostCard } from "../PostCard";
import s from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

const snippet = (html: string, max = 155) => {
  const text = html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, text.lastIndexOf(" ", max))}…`;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return { title: "Blog" };
  const cover = mediaUrl(post.cover);
  // Google description: the excerpt; without it, the start of the post.
  const description = post.excerpt || snippet(post.bodyHtml ?? "") || undefined;
  return {
    title: post.title,
    description,
    openGraph: { type: "article", title: post.title, description, images: cover ? [cover] : undefined },
  };
}

/** Post do blog. O texto chega do painel já em HTML (campo bodyHtml). */
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const more = (await getPosts()).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className={s.page}>
      <PostArticle
        post={{
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          author: post.author,
          category: categoryName(post),
          cover: mediaUrl(post.cover),
          bodyHtml: post.bodyHtml,
          readMinutes: post.readMinutes,
        }}
      />

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
