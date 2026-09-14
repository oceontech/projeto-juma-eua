import { cache } from "react";
import { cookies } from "next/headers";
import { getDictionary, LOCALE_COOKIE, resolveLocale } from "@/content";

/** Idioma do pedido, para Server Components. Ver src/content/index.ts. */
export const getLocale = cache(async () =>
  resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value),
);

export async function getContent() {
  return getDictionary(await getLocale());
}
