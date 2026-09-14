import * as enAminosan from "./aminosan";
import * as enHome from "./home";
import * as ptAminosan from "./pt/aminosan";
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

export type Content = { home: typeof enHome; aminosan: typeof enAminosan };

const dictionaries: Record<Locale, Content> = {
  en: { home: enHome, aminosan: enAminosan },
  pt: { home: ptHome, aminosan: ptAminosan },
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
