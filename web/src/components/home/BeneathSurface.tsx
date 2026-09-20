"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useContent } from "@/components/layout/LocaleProvider";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./BeneathSurface.module.css";

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Botanical exploration: both images share one camera to keep the reveal aligned. */
export function BeneathSurface() {
  const { beneath } = useContent().home;
  const root = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useGSAP(() => {
    const section = root.current!;
    const camera = section.querySelector<HTMLElement>("[data-surface-camera]")!;
    const spotlight = section.querySelector<HTMLElement>("[data-surface-spotlight]")!;
    const cursor = section.querySelector<HTMLElement>("[data-surface-cursor]")!;
    const lens = section.querySelector<HTMLElement>("[data-surface-lens]");
    const touchZone = section.querySelector<HTMLElement>("[data-surface-touch-zone]");
    let frame = 0;
    let clientX = 0;
    let clientY = 0;

    // Backgrounds download shortly before this section reaches the viewport.
    const loadMedia = () => section.setAttribute("data-loaded", "true");
    const loader = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            loadMedia();
            loader?.disconnect();
          }
        }, { rootMargin: "800px" })
      : null;
    if (loader) loader.observe(section);
    else loadMedia();

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // The camera, text entrances and exit wrapper each own their transforms.
      gsap.timeline({
        scrollTrigger: {
          id: "surface-entrance", trigger: section,
          start: "top 88%", end: "top 12%", scrub: 0.65,
        },
      })
        .fromTo(camera, { scale: 1.12 }, { scale: 1, duration: 1.3, ease: "power2.out" }, 0)
        .fromTo("[data-surface-line]", { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" }, 0.16)
        .fromTo("[data-surface-enter]", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08, ease: "power2.out" }, 0.38);

      gsap.timeline({
        scrollTrigger: {
          id: "surface-exit", trigger: section,
          start: "bottom 65%", end: "bottom top", scrub: 0.55,
        },
      })
        .fromTo("[data-surface-exit]", { y: 0, opacity: 1 }, { y: -36, opacity: 0, duration: 1, ease: "power1.in" }, 0);
    });

    const renderPointer = () => {
      frame = 0;
      // Convert viewport coordinates into the scaled image's coordinate space.
      const bounds = camera.getBoundingClientRect();
      const scale = bounds.width / camera.offsetWidth;
      const x = (clientX - bounds.left) / scale;
      const y = (clientY - bounds.top) / scale;
      const radius = (window.innerWidth < 480 ? 130 : window.innerWidth < 720 ? 160 : 260) / scale;
      const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #fff 0%, #fff 40%, rgba(255,255,255,.75) 60%, rgba(255,255,255,.4) 75%, rgba(255,255,255,.12) 88%, transparent 100%)`;
      spotlight.style.maskImage = mask;
      spotlight.style.webkitMaskImage = mask;
      const sectionBounds = section.getBoundingClientRect();
      cursor.style.transform = `translate3d(${clientX - sectionBounds.left}px, ${clientY - sectionBounds.top}px, 0)`;
    };

    const move = (event: PointerEvent) => {
      // Touch keeps native vertical scrolling; the buttons offer a full reveal.
      if (event.pointerType === "touch") return;
      const target = event.target;
      const overControl = target instanceof Element && !!target.closest("a, button");
      section.dataset.exploring = overControl ? "false" : "true";
      clientX = event.clientX;
      clientY = event.clientY;
      if (!frame) frame = requestAnimationFrame(renderPointer);
    };
    const leave = () => {
      section.dataset.exploring = "false";
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };
    // Touch has no hover: the lens is a handle. Dragging it moves the reveal
    // under the finger, the same structure the mouse uncovers on desktop.
    let dragging = false;
    let offX = 0;
    let offY = 0;
    let grabX = 0;
    let grabY = 0;
    let lensBaseLeft = 0;
    let lensBaseTop = 0;
    const placeLens = () => {
      frame = 0;
      if (!lens) return;
      lens.style.transform = `translate3d(${offX}px, ${offY}px, 0)`;
      const bounds = lens.getBoundingClientRect();
      clientX = bounds.left + bounds.width / 2;
      clientY = bounds.top + bounds.height / 2;
      renderPointer();
    };
    const lensDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" || !lens) return;
      event.preventDefault();
      dragging = true;
      try {
        lens.setPointerCapture(event.pointerId);
      } catch {
        /* sem captura o arraste segue pelos eventos do próprio punho */
      }
      grabX = event.clientX - offX;
      grabY = event.clientY - offY;
      section.dataset.exploring = "true";
      section.dataset.dragging = "true";
      const bounds = lens.getBoundingClientRect();
      lensBaseLeft = bounds.left - offX;
      lensBaseTop = bounds.top - offY;
      placeLens();
    };
    const lensMove = (event: PointerEvent) => {
      if (!dragging || !lens) return;
      const nextX = event.clientX - grabX;
      const nextY = event.clientY - grabY;
      const zoneBounds = touchZone?.getBoundingClientRect();
      if (zoneBounds && zoneBounds.width > 0 && zoneBounds.height > 0) {
        offX = Math.min(Math.max(nextX, zoneBounds.left - lensBaseLeft), zoneBounds.right - lensBaseLeft - lens.offsetWidth);
        offY = Math.min(Math.max(nextY, zoneBounds.top - lensBaseTop), zoneBounds.bottom - lensBaseTop - lens.offsetHeight);
      } else {
        offX = nextX;
        offY = nextY;
      }
      if (!frame) frame = requestAnimationFrame(placeLens);
    };
    const lensUp = () => {
      dragging = false;
      section.dataset.dragging = "false";
    };
    lens?.addEventListener("pointerdown", lensDown);
    lens?.addEventListener("pointermove", lensMove);
    lens?.addEventListener("pointerup", lensUp);
    lens?.addEventListener("pointercancel", lensUp);

    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    section.addEventListener("pointercancel", leave);

    return () => {
      media.revert();
      loader?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      section.removeEventListener("pointercancel", leave);
      lens?.removeEventListener("pointerdown", lensDown);
      lens?.removeEventListener("pointermove", lensMove);
      lens?.removeEventListener("pointerup", lensUp);
      lens?.removeEventListener("pointercancel", lensUp);
    };
  }, { scope: root });

  return (
    <section
      ref={root} id="beneath-the-surface" className={styles.section}
      data-nav-theme="dark" data-revealed={revealed}
      aria-labelledby="surface-title"
    >
      <div className={styles.camera} data-surface-camera aria-hidden="true">
        <div className={`${styles.image} ${styles.base}`} />
        <div className={styles.revealBand}>
          <div className={`${styles.image} ${styles.spotlight}`} data-surface-spotlight />
          <div className={`${styles.image} ${styles.fullReveal}`} />
        </div>
      </div>
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.entryFade} aria-hidden="true" />
      <div className={styles.touchZone} data-surface-touch-zone aria-hidden="true" />

      <div className={styles.ui} data-surface-exit>
        <div className={styles.topline} data-surface-enter>
          <p className={styles.eyebrow}><span />{beneath.eyebrow}</p>
          <span className={styles.edition}>{beneath.edition} <span>/ 01</span></span>
        </div>

        <div className={styles.copy}>
          <h2 id="surface-title" className={styles.title}>
            <span className={styles.line}><span data-surface-line>{beneath.title[0]}</span></span>{" "}
            <span className={styles.line}><span data-surface-line>{beneath.title[1]}</span></span>
          </h2>
          <p className={styles.description} data-surface-enter>
            {beneath.description}
          </p>
          <div className={styles.controls} role="group" aria-label={beneath.viewLabel} data-surface-enter>
            <button type="button" aria-pressed={!revealed} onClick={() => { setRevealed(false); if (root.current) root.current.dataset.exploring = "false"; }}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M15.5 3.5c-8-1-12 3-10 9 6 2 10-2 10-9ZM4 16 12 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {beneath.natural}
            </button>
            <button type="button" aria-pressed={revealed} onClick={() => setRevealed(true)}>
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 7V3h4m6 0h4v4m0 6v4h-4m-6 0H3v-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.2" /></svg>
              {beneath.reveal}
            </button>
          </div>
        </div>

        <div className={styles.exploreHint} data-surface-enter aria-hidden="true">
          <span className={styles.target} data-surface-lens><i /><i /></span>
          <span className={styles.mouseHint}>{beneath.mouseHint}</span>
          <span className={styles.touchHint}>{beneath.touchHint}</span>
        </div>

        <div className={styles.bottom}>
          <article className={styles.product} data-surface-enter>
            <div className={styles.thumb} aria-hidden="true" />
            <div>
              <p className={styles.productLabel}>{beneath.product.label}</p>
              <h3>Aminosan<sup>®</sup></h3>
              <p className={styles.productCopy}>{beneath.product.copy}</p>
              <Link href="/aminosan" className={styles.productLink}>{beneath.product.link} <Arrow /></Link>
            </div>
          </article>

          <div className={styles.notes} data-surface-enter>
            <h3>{beneath.notes.title}</h3>
            <dl>
              <div><dt>{beneath.notes.focus.term}</dt><dd>{beneath.notes.focus.value}</dd></div>
              <div><dt>{beneath.notes.roots.term}</dt><dd>{beneath.notes.roots.value}</dd></div>
              <div><dt>{beneath.notes.next.term}</dt><dd><a href="#us-operation">{beneath.notes.next.value} <Arrow /></a></dd></div>
            </dl>
          </div>
        </div>

        <div className={styles.footer} data-surface-enter>
          <span>{beneath.footer.left}</span>
          <span className={styles.footerRight}>{beneath.footer.right}<span>↓</span></span>
        </div>
      </div>
      <div className={styles.cursor} data-surface-cursor aria-hidden="true"><span>+</span></div>
    </section>
  );
}
