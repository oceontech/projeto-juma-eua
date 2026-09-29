import type { Metadata } from "next";
import { PreviewFrame } from "./PreviewFrame";

export const metadata: Metadata = { title: "Preview", robots: { index: false, follow: false } };

/** Prévia do post usada pelo painel central (iframe). */
export default function PreviewPage() {
  return <PreviewFrame />;
}
