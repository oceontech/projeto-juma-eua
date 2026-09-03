import type { Metadata } from "next";
import { Archivo, DM_Sans, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollRefresh } from "@/components/motion/ScrollRefresh";
import { SmoothAnchors } from "@/components/motion/SmoothAnchors";
import "./globals.css";

/**
 * O layout do Figma usa Neue Plak, que é licenciada. Archivo é a grotesk
 * livre mais próxima em largura e terminais. Para trocar quando a licença
 * entrar: `next/font/local` apontando para os arquivos, mantendo a mesma
 * variável `--font-archivo` — o resto do CSS não muda.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Só as tags dos programas usam DM Sans, como no layout. */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://juma-agro-eua.vercel.app"),
  title: {
    default: "Juma-Agro Fertilizer LLC — Proven where the harvest never stops.",
    template: "%s — Juma-Agro Fertilizer LLC",
  },
  description:
    "Brazilian foliar nutrition, tested for 38 years in two and three crops a year. Run a trial strip on your own acres — we supply the product.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Juma-Agro Fertilizer LLC",
  },
  /* O site não vai ao ar antes da liberação regulatória da LLC. */
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body>
        <ScrollRefresh />
        <SmoothAnchors />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
