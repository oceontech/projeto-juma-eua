import type { Metadata } from "next";
import { preload } from "react-dom";
import { Archivo, DM_Sans, Inter } from "next/font/google";
import { LocaleProvider } from "@/components/layout/LocaleProvider";
import { PageTransition } from "@/components/layout/PageTransition";
import { Preloader } from "@/components/layout/Preloader";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollRefresh } from "@/components/motion/ScrollRefresh";
import { SmoothAnchors } from "@/components/motion/SmoothAnchors";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getLocale } from "@/lib/locale";
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  /* O JSON da animação do véu começa a baixar com o HTML, e não depois de o
     JavaScript chegar (ver Preloader.tsx). `crossOrigin` casa com o modo do
     `fetch`, para o pedido reaproveitar este. */
  preload("/anim/preloader.json", { as: "fetch", crossOrigin: "anonymous" });

  return (
    <html
      lang={locale === "pt" ? "pt-BR" : "en"}
      className={`${archivo.variable} ${inter.variable} ${dmSans.variable}`}
    >
      <body suppressHydrationWarning>
        {/* Zera a rolagem antes de qualquer hidratação, atrás do véu opaco
            do <Preloader>. Sem isto, uma recarga com a posição preservada
            pelo navegador deixa cada seção montar seu próprio ScrollTrigger
            já rolada fundo — vários nascem com o ponto de partida no
            passado, e o refresh() do <Preloader> que precisa reconciliar
            todos de uma vez corrompe a lista interna do ScrollTrigger e
            derruba a página. `useGSAP` usa `useLayoutEffect`, que dispara
            antes de qualquer `useEffect` — inclusive o do próprio
            <Preloader> —, então só um script síncrono, antes da hidratação,
            chega a tempo. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'if("scrollRestoration" in history){history.scrollRestoration="manual";}window.scrollTo(0,0);',
          }}
        />
        <Preloader />
        {/* O véu das trocas de página: mesma marca, em loop até a página
            nova chegar. */}
        <PageTransition />
        <ScrollRefresh />
        <SmoothAnchors />
        <SmoothScroll />
        <LocaleProvider locale={locale}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
