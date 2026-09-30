import type { Metadata } from "next";
import { categoryName, getPosts, mediaUrl } from "@/lib/panel";
import { BlogIndex } from "./BlogIndex";
import type { CardView } from "./PostCard";
import s from "./blog.module.css";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Practical notes on foliar nutrition, application and field trials from the Juma-Agro agronomy team.",
};

/** Lista do blog. Os posts vêm do painel central (Site EUA › Blog). */
export default async function BlogPage() {
  const posts: CardView[] = (await getPosts()).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    date: p.date,
    category: categoryName(p),
    readMinutes: p.readMinutes,
    cover: mediaUrl(p.cover),
  }));
  const topics = new Set(posts.map((p) => p.category).filter(Boolean)).size;

  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <header className={s.hero}>
          <div>
            <p className={s.eyebrow}>Juma-Agro field notes</p>
            <h1 className={s.heroTitle}>
              Notes from <span>the field.</span>
            </h1>
          </div>
          <div className={s.heroAside}>
            <p className={s.lede}>
              Practical notes on foliar nutrition, application and on-farm trials, written by our agronomy team for U.S. growers
              and crop advisers.
            </p>
            {posts.length > 0 && (
              <p className={s.heroStats}>
                <span>
                  <b>{posts.length}</b> {posts.length === 1 ? "note" : "notes"}
                </span>
                {topics > 0 && (
                  <span>
                    <b>{topics}</b> {topics === 1 ? "topic" : "topics"}
                  </span>
                )}
              </p>
            )}
          </div>
        </header>

        <BlogIndex posts={posts} />
      </div>
    </div>
  );
}
