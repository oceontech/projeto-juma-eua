"use client";

import { createContext, useContext } from "react";
import { getDictionary, LOCALE_COOKIE, type Locale } from "@/content";

/** O idioma que o layout leu do cookie, para Client Components. */
const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

export function useContent() {
  return getDictionary(useLocale());
}

/* Recarregar, e não `router.refresh()`: as cenas do GSAP partem e medem o
   texto na montagem, e trocar o texto por baixo delas deixaria tudo torto. */
export function switchLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}
