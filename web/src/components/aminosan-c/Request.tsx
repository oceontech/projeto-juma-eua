"use client";

import { useActionState } from "react";
import { useContent } from "@/components/layout/LocaleProvider";
import { submitTrialRequest, type TrialRequestState } from "@/lib/actions";

/**
 * O pedido de faixa de teste, no registro escuro desta versão.
 *
 * O Server Action é o mesmo das outras páginas — só o vestido muda. O
 * `source` separa de qual versão do teste o lead veio, que é o dado sem o
 * qual o A/B não serve para nada.
 */

const INITIAL: TrialRequestState = { status: "idle", message: "", errors: {} };

export function Request() {
  const { request } = useContent().aminosanC;
  const [state, action, pending] = useActionState(submitTrialRequest, INITIAL);
  const { fields } = request;

  return (
    <section
      id="trial-form"
      data-nav-theme="dark"
      className="relative bg-[#04090B] py-[clamp(72px,10vw,150px)] text-[#CFE6E3]"
    >
      <div aria-hidden className="sc-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="wrap relative grid gap-[clamp(36px,5vw,80px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="sc-tag">{request.tag}</p>
          <h2 className="mt-5 text-[clamp(34px,4.2vw,76px)] leading-[0.96] tracking-[-0.035em] text-white">
            {request.heading.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[44ch] text-[clamp(13px,1.05vw,17px)] leading-[1.55] text-[#93B3B0]">
            {request.body}
          </p>
          <p className="mt-8 max-w-[46ch] text-[12px] leading-[1.5] text-[#4E7C7A]">{request.note}</p>
        </div>

        <form action={action} className="grid gap-5 border border-[#153036] bg-[#061114] p-[clamp(20px,2.4vw,40px)]">
          <input type="hidden" name="source" value="aminosan-c" />

          {(
            [
              ["name", fields.name, "text", "name"],
              ["email", fields.email, "email", "email"],
              ["state", fields.state, "text", "address-level1"],
              ["crop", fields.crop, "text", "off"],
            ] as const
          ).map(([name, field, type, complete]) => (
            <label key={name} className="grid gap-2">
              <span className="sc-tag text-[#4E7C7A]">{field.label}</span>
              <input
                name={name}
                type={type}
                autoComplete={complete}
                placeholder={field.placeholder}
                aria-invalid={state.errors[name] ? true : undefined}
                className="border-b border-[#1D3F45] bg-transparent pb-2.5 text-[15px] text-white outline-none transition-colors placeholder:text-[#3C5F5E] focus:border-[#7FE7D2] aria-[invalid]:border-[#E8886A]"
              />
              {state.errors[name] && (
                <span className="text-[12px] text-[#E8886A]">{state.errors[name]}</span>
              )}
            </label>
          ))}

          <label className="mt-1 flex items-start gap-3 text-[13px] leading-[1.4] text-[#93B3B0]">
            <input
              name="call"
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 appearance-none border border-[#1D3F45] bg-transparent checked:border-[#7FE7D2] checked:bg-[#7FE7D2]"
            />
            {request.call}
          </label>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 border border-[#7FE7D2] px-6 py-3.5 font-display text-[11px] tracking-[0.18em] text-[#7FE7D2] uppercase transition-colors duration-300 hover:bg-[#7FE7D2] hover:text-[#04090B] disabled:opacity-50"
          >
            {pending ? request.sending : request.submit}
          </button>

          {state.status !== "idle" && (
            <p
              role="status"
              className={`text-[13px] leading-[1.45] ${
                state.status === "success" ? "text-[#7FE7D2]" : "text-[#E8886A]"
              }`}
            >
              {state.message}
            </p>
          )}

          <p className="text-[11px] leading-[1.5] text-[#3C5F5E]">{request.privacy}</p>
        </form>
      </div>
    </section>
  );
}
