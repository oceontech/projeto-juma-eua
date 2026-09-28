"use server";

import { cookies, headers } from "next/headers";

/**
 * Server Action do pedido de faixa de teste.
 *
 * O lead vai para o painel da Juma (Payload do site BR, em
 * juma-agro.com.br/admin), pelo endpoint `POST /api/leads/intake`, autenticado
 * pela chave do site americano. O painel deduplica, guarda a origem e mostra o
 * lead na caixa "Estados Unidos". Ver ../projeto-juma/docs/01-prd/painel-central.md.
 *
 * Variáveis: LEADS_INTAKE_URL (ex.: https://juma-agro.com.br/api/leads/intake)
 * e LEADS_INTAKE_KEY. Sem elas, em desenvolvimento o lead só vai para o log.
 */

export type TrialRequestState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Campo → mensagem, para marcar o input que falhou. */
  errors: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/* Nome do produto que aparece no painel, a partir da página que enviou. */
const PRODUCT_BY_SOURCE: Record<string, string> = {
  kmep: "KMEP Ultra®",
  aminosan: "Aminosan®",
};
const FIRST_TOUCH_COOKIE = "juma_first";
const LAST_TOUCH_COOKIE = "juma_last";

const SEND_FAILED: TrialRequestState = {
  status: "error",
  message: "We couldn’t send your request. Please try again in a moment.",
  errors: {},
};

function parseTouch(raw?: string) {
  if (!raw) return undefined;
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return undefined;
  }
}

function decode(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function submitTrialRequest(
  _previous: TrialRequestState,
  formData: FormData,
): Promise<TrialRequestState> {
  const field = (name: string) => String(formData.get(name) ?? "").trim();

  const lead = {
    name: field("name"),
    company: field("company"),
    state: field("state"),
    crop: field("crop"),
    acres: field("acres"),
    email: field("email"),
    problem: field("problem"),
    wantsCall: formData.get("call") === "on",
    /* Qual página mandou o pedido; a variante separa as versões do teste A/B. */
    source: field("source"),
    variant: field("variant"),
  };

  const errors: Record<string, string> = {};
  if (!lead.name) errors.name = "Tell us your name.";
  if (!lead.email) errors.email = "We need an email to answer you.";
  else if (!EMAIL.test(lead.email)) errors.email = "That email doesn’t look right.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      errors,
    };
  }

  const url = process.env.LEADS_INTAKE_URL;
  const key = process.env.LEADS_INTAKE_KEY;
  if (!url || !key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[trial-request] (sem LEADS_INTAKE_URL/KEY, só log)", lead);
      return { status: "success", message: "Request received. Someone from the U.S. team will reach out.", errors: {} };
    }
    console.error("[trial-request] LEADS_INTAKE_URL/LEADS_INTAKE_KEY ausentes: lead não enviado");
    return SEND_FAILED;
  }

  const [h, c] = await Promise.all([headers(), cookies()]);
  const startedAt = Number(field("startedAt"));

  const body = {
    lead: {
      formulario: field("compact") ? "trial-compact" : "trial",
      nome: lead.name,
      email: lead.email,
      empresa: lead.company || undefined,
      mensagem: lead.problem || undefined,
      locale: "en",
      pagina: field("page") || undefined,
      contexto: { produto: PRODUCT_BY_SOURCE[lead.source], cultura: lead.crop || undefined },
      variante: lead.variant || undefined,
      dados: {
        state: lead.state,
        crop: lead.crop,
        acres: lead.acres,
        wantsCall: lead.wantsCall,
        source: lead.source,
      },
      primeiroToque: parseTouch(c.get(FIRST_TOUCH_COOKIE)?.value),
      ultimoToque: parseTouch(c.get(LAST_TOUCH_COOKIE)?.value),
      website: field("website"),
      tempoMs: startedAt ? Date.now() - startedAt : undefined,
    },
    meta: {
      userAgent: h.get("user-agent"),
      pais: h.get("x-vercel-ip-country"),
      regiao: h.get("x-vercel-ip-country-region"),
      cidade: decode(h.get("x-vercel-ip-city")),
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-leads-key": key },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const result = (await response.json().catch(() => null)) as
      | { ok: boolean; error?: string; fields?: string[] }
      | null;

    if (!result?.ok) {
      // Robô: responde como sucesso, sem dar pista.
      if (result?.error === "spam") {
        return { status: "success", message: "Request received. Someone from the U.S. team will reach out.", errors: {} };
      }
      if (result?.error === "invalid" && result.fields?.includes("email")) {
        return {
          status: "error",
          message: "Check the highlighted fields.",
          errors: { email: "That email doesn’t look right." },
        };
      }
      console.error("[trial-request] painel recusou o lead", response.status, result);
      return SEND_FAILED;
    }
  } catch (error) {
    console.error("[trial-request] falha ao enviar ao painel", error);
    return SEND_FAILED;
  }

  return {
    status: "success",
    message: "Request received. Someone from the U.S. team will reach out.",
    errors: {},
  };
}
