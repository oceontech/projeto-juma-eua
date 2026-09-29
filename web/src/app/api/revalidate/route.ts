import { revalidatePath, revalidateTag } from "next/cache";

/**
 * O painel chama aqui ao publicar um post ou salvar o contato, para o site
 * mostrar a mudança na hora (sem esperar os 5 minutos do cache).
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { paths?: unknown };
  const paths = Array.isArray(body.paths) ? body.paths.filter((p): p is string => typeof p === "string" && p.startsWith("/")) : [];

  revalidateTag("blog", "max");
  revalidateTag("settings", "max");
  for (const path of paths) revalidatePath(path);
  return Response.json({ ok: true, paths });
}
