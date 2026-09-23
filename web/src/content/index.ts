import * as enAminosan from "./aminosan";
import * as enAminosanB from "./aminosan-b";
import * as enAminosanC from "./aminosan-c";
import * as enHome from "./home";
import * as ptAminosan from "./pt/aminosan";
import * as ptAminosanB from "./pt/aminosan-b";
import * as ptAminosanC from "./pt/aminosan-c";
import * as ptHome from "./pt/home";

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
  aminosan: typeof enAminosan;
  /** LP B do Aminosan, para o teste A/B (rota /aminosan-b). */
  aminosanB: typeof enAminosanB;
  /** LP C do Aminosan, a versão de instrumento (rota /aminosan-c). */
  aminosanC: typeof enAminosanC;
};

const dictionaries: Record<Locale, Content> = {
  en: { home: enHome, aminosan: enAminosan, aminosanB: enAminosanB, aminosanC: enAminosanC },
  pt: { home: ptHome, aminosan: ptAminosan, aminosanB: ptAminosanB, aminosanC: ptAminosanC },
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
