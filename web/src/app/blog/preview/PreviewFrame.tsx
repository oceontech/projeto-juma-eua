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

  /* Prévia travada: dá para rolar e ver o post, mas não sair dele nem abrir nada. */
  useEffect(() => {
    const block = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, form, input, select, textarea, label, [role='button']")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    const style = document.createElement("style");
    style.textContent =
      "a, button, input, select, textarea, label, [role='button'] { pointer-events: none !important; cursor: default !important; }";
    document.head.appendChild(style);
    document.addEventListener("click", block, true);
    document.addEventListener("submit", block, true);
    return () => {
      document.removeEventListener("click", block, true);
      document.removeEventListener("submit", block, true);
      style.remove();
    };
  }, []);

  return (
    <div className={s.page}>
      {post ? <PostArticle post={post} /> : <p className={s.empty}>Loading preview…</p>}
    </div>
  );
}
