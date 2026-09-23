import * as enAminosan from "./aminosan";
import * as enAminosanB from "./aminosan-b";
import * as enHome from "./home";
import * as enKmep from "./kmep";
import * as ptAminosan from "./pt/aminosan";
import * as ptAminosanB from "./pt/aminosan-b";
import * as ptHome from "./pt/home";
import * as ptKmep from "./pt/kmep";

/**
 * Seleção de idioma — provisória.
 *
 * O site é para os EUA e fala inglês; o português existe para a Juma revisar
 * o conteúdo. O idioma mora num cookie e a troca recarrega a página: sem rota
 * por idioma, sem biblioteca. Quando a revisão terminar, sai tudo daqui.
 */
export type Locale = "en" | "pt";

export const LOCALE_COOKIE = "locale";

export type Content = {
  home: typeof enHome;
  /** Versão anterior da LP do Aminosan (rota /aminosan-b). */
  aminosan: typeof enAminosan;
  /** LP principal do Aminosan (rota /aminosan) — nasceu como versão B. */
  aminosanB: typeof enAminosanB;
  /** LP do KMEP Ultra (rota /kmep). */
  kmep: typeof enKmep;
};

const dictionaries: Record<Locale, Content> = {
  en: {
    home: enHome,
    aminosan: enAminosan,
    aminosanB: enAminosanB,
    kmep: enKmep,
  },
  pt: {
    home: ptHome,
    aminosan: ptAminosan,
    aminosanB: ptAminosanB,
    kmep: ptKmep,
  },
};

export const languages: { locale: Locale; src: string; label: string }[] = [
  { locale: "pt", src: "/img/flag-br.png", label: "Português (Brasil)" },
  { locale: "en", src: "/img/flag-us.png", label: "English (United States)" },
];

export function resolveLocale(value: string | undefined): Locale {
  return value === "pt" ? "pt" : "en";
}

export function getDictionary(locale: Locale): Content {
  return dictionaries[locale];
}
