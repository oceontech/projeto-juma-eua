"use client";

import { useEffect, useState } from "react";
import type { Heading } from "./html";
import s from "./blog.module.css";

/** Barra lima no topo que enche conforme a leitura do texto do post. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setPct(Math.max(0, Math.min(1, (window.innerHeight * 0.4 - r.top) / Math.max(total, 1))));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);
  return (
    <div className={s.progress} aria-hidden>
      <span style={{ transform: `scaleX(${pct})` }} />
    </div>
  );
}

/** Índice "On this page" com o intertítulo atual destacado. */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState(headings[0]?.id);
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;
  return (
    <nav className={s.toc} aria-label="On this page">
      <p className={s.asideLabel}>On this page</p>
      <ol>
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} aria-current={active === h.id ? "true" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const Icon = {
  link: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
      <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M6.5 9.5v8M6.5 6.5v.01M10.5 17.5v-4.5a3 3 0 0 1 6 0v4.5M10.5 9.5v8" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
};

/** Compartilhar: copiar link, LinkedIn, X e e-mail. */
export function Share({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => setUrl(window.location.href.split("#")[0]), []);
  const enc = encodeURIComponent;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* sem permissão de área de transferência: nada a fazer */
    }
  };
  return (
    <div className={s.share}>
      <button type="button" onClick={copy} aria-label="Copy link" title={copied ? "Copied" : "Copy link"} data-copied={copied || undefined}>
        {Icon.link}
      </button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        {Icon.linkedin}
      </a>
      <a href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        {Icon.x}
      </a>
      <a href={`mailto:?subject=${enc(title)}&body=${enc(url)}`} aria-label="Share by email">
        {Icon.mail}
      </a>
      {copied && <span className={s.copied}>Link copied</span>}
    </div>
  );
}
