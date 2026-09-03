"use server";

/**
 * Server Action do pedido de faixa de teste.
 *
 * O PRD pede o formulário desacoplado do destino final: a validação e o
 * contrato de retorno ficam aqui; para onde o lead vai (e-mail, CRM, webhook)
 * é uma linha só, marcada abaixo. Enquanto o destino não for decidido, o
 * action valida, registra no servidor e devolve sucesso.
 */

export type TrialRequestState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Campo → mensagem, para marcar o input que falhou. */
  errors: Record<string, string>;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // TODO(P11): plugar o destino real do lead aqui — e-mail para a LLC, CRM
  // ou webhook. O contrato de retorno abaixo não muda.
  console.info("[trial-request]", lead);

  return {
    status: "success",
    message: "Request received. Someone from the U.S. team will reach out.",
    errors: {},
  };
}
