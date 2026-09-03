"use client";

import Image from "next/image";
import { useActionState, useId } from "react";
import { submitTrialRequest, type TrialRequestState } from "@/lib/actions";
import { usOperation } from "@/content/home";
import { cx } from "@/components/ui";

const { form } = usOperation;

const INITIAL: TrialRequestState = { status: "idle", message: "", errors: {} };

/**
 * Formulário do pedido de faixa de teste.
 *
 * useActionState liga o form ao Server Action: o envio funciona antes do
 * JavaScript carregar, e depois dele vira uma transição sem recarregar a
 * página. O estado de erro volta do servidor, não é revalidado no cliente.
 */
export function TrialForm() {
  const [state, action, pending] = useActionState(submitTrialRequest, INITIAL);
  const id = useId();

  return (
    <form action={action} noValidate>
      <div className="grid grid-cols-1 gap-x-[clamp(16px,1vw,20px)] gap-y-[clamp(20px,1.55vw,31px)] min-[861px]:grid-cols-2">
        <Field id={`${id}-name`} label={form.name.label} error={state.errors.name}>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name.placeholder}
            className="field-input"
          />
        </Field>

        <Field id={`${id}-company`} label={form.company.label}>
          <input
            id={`${id}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={form.company.placeholder}
            className="field-input"
          />
        </Field>

        <Field id={`${id}-state`} label={form.state.label}>
          <Select id={`${id}-state`} name="state" options={form.state.options} />
        </Field>

        <Field id={`${id}-crop`} label={form.crop.label}>
          <Select id={`${id}-crop`} name="crop" options={form.crop.options} />
        </Field>

        <Field id={`${id}-acres`} label={form.acres.label}>
          <Select id={`${id}-acres`} name="acres" options={form.acres.options} />
        </Field>

        <Field id={`${id}-email`} label={form.email.label} error={state.errors.email}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={form.email.placeholder}
            className="field-input"
          />
        </Field>

        <Field
          id={`${id}-problem`}
          label={form.problem.label}
          className="min-[861px]:col-span-2"
        >
          <textarea
            id={`${id}-problem`}
            name="problem"
            placeholder={form.problem.placeholder}
            className="field-input min-h-[178px] resize-y"
          />
        </Field>
      </div>

      <div className="mt-[clamp(24px,2.5vw,47px)] flex items-start gap-5">
        <input
          id={`${id}-call`}
          name="call"
          type="checkbox"
          className="mt-[3px] size-5 shrink-0 cursor-pointer appearance-none rounded-[2px] border border-lime bg-[#F0F0F0] checked:bg-lime"
        />
        <label htmlFor={`${id}-call`} className="text-small text-muted">
          {form.call}
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-[clamp(20px,2.2vw,41px)] inline-flex cursor-pointer items-center gap-2.5 rounded-lg bg-lime px-[clamp(34px,3.9vw,75px)] py-[clamp(14px,1vw,20px)] font-display text-[clamp(16px,1.25vw,24px)] font-semibold text-white transition-colors hover:bg-[#A6B534] disabled:opacity-60"
      >
        {pending ? "Sending…" : form.submit}
        <Image src="/img/icon-arrow-white.svg" alt="" width={14} height={15} />
      </button>

      {state.status !== "idle" && (
        <p
          role="status"
          className={cx(
            "mt-4 text-small",
            state.status === "success" ? "text-green-brand" : "text-kmep",
          )}
        >
          {state.message}
        </p>
      )}

      <p className="mt-[clamp(18px,1.9vw,36px)] max-w-[620px] text-small text-muted">
        {form.privacy.before}
        <a href="#" className="text-lime">
          {form.privacy.link}
        </a>
        {form.privacy.after}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cx("flex flex-col gap-[clamp(10px,1vw,20px)]", className)}>
      <label htmlFor={id} className="text-small font-semibold text-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-small text-kmep">{error}</p>}
    </div>
  );
}

function Select({
  id,
  name,
  options,
}: {
  id: string;
  name: string;
  options: readonly string[];
}) {
  return (
    <select id={id} name={name} className="field-input" defaultValue={options[0]}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}
