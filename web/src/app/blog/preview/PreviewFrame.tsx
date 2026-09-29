"use client";

import { useEffect, useState } from "react";
import { PostArticle, type PostView } from "../PostArticle";
import s from "../blog.module.css";

/* O painel central mora em outro domínio: só aceita mensagens dele (ou do teste local). */
const PANEL = /^https:\/\/(www\.)?juma-agro\.com\.br$|^http:\/\/localhost(:\d+)?$/;

/**
 * Prévia do post para o painel (iframe): o formulário manda o rascunho por
 * postMessage e ele aparece com o mesmo componente da página do post.
 */
export function PreviewFrame() {
  const [post, setPost] = useState<PostView | null>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!PANEL.test(e.origin) || e.data?.type !== "juma:post-preview" || !e.data.post) return;
      setPost(e.data.post as PostView);
    };
    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: "juma:preview-ready" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className={s.page}>
      {post ? <PostArticle post={post} /> : <p className={s.empty}>Loading preview…</p>}
    </div>
  );
}
