import type { Metadata } from "next";
import { getPosts } from "@/lib/panel";
import { PostCard } from "./PostCard";
import s from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Field notes from Juma-Agro: foliar nutrition, trials and the thinking behind our products.",
};

/** Lista do blog. Os posts vêm do painel central (Site EUA › Blog). */
export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className={s.page}>
      <div className={s.wrap}>
        <p className={s.eyebrow}>Juma field notes</p>
        <h1 className={s.title}>Blog</h1>
        <p className={s.lede}>Foliar nutrition, field trials and what we learn season after season.</p>

        {posts.length ? (
          <ul className={s.grid}>
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.empty}>The first notes are on their way. Check back soon.</p>
        )}
      </div>
    </div>
  );
}
