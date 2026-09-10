"use client";

import Image from "next/image";
import { useActionState, useId } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/components/ui";
import { submitTrialRequest, type TrialRequestState } from "@/lib/actions";
import { trialRequest } from "@/content/aminosan";

const INITIAL: TrialRequestState = { status: "idle", message: "", errors: {} };

export function TrialRequest() {
  const [state, action, pending] = useActionState(submitTrialRequest, INITIAL);
  const id = useId();
  const { fields } = trialRequest;

  return (
    <section id="trial-request" className="bg-white py-[clamp(56px,7vw,124px)]">
      <div className="wrap grid grid-cols-1 gap-[clamp(24px,3vw,40px)] lg:grid-cols-[660fr_530fr]">
        <Reveal y={18}>
          <h2 className="text-h2 leading-[1.05] text-ink">
            {trialRequest.heading[0]}
            <br /> {trialRequest.heading[1]}
          </h2>
        </Reveal>
        <Reveal y={18} delay={0.06} className="lg:justify-self-end">
          <p className="max-w-[46ch] font-light leading-[1.55] text-muted">{trialRequest.description}</p>
        </Reveal>
      </div>

      <Reveal y={20} delay={0.1} className="wrap mt-[clamp(32px,4vw,56px)] max-w-[1320px]">
        <form action={action} noValidate>
          <div className="grid grid-cols-1 gap-x-[clamp(20px,2vw,32px)] gap-y-[clamp(16px,1.6vw,20px)] sm:grid-cols-2">
            <Field id={`${id}-name`} label={fields.name.label} error={state.errors.name}>
              <input
                id={`${id}-name`}
                name="name"
                type="text"
                autoComplete="name"
                placeholder={fields.name.placeholder}
                className="field-input"
              />
            </Field>

            <Field id={`${id}-email`} label={fields.email.label} error={state.errors.email}>
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder={fields.email.placeholder}
                className="field-input"
              />
            </Field>

            <Field id={`${id}-state`} label={fields.state.label}>
              <input
                id={`${id}-state`}
                name="state"
                type="text"
                autoComplete="address-level1"
                placeholder={fields.state.placeholder}
                className="field-input"
              />
            </Field>

            <Field id={`${id}-crop`} label={fields.crop.label}>
              <input id={`${id}-crop`} name="crop" type="text" placeholder={fields.crop.placeholder} className="field-input" />
            </Field>
          </div>

          <div className="mt-[clamp(18px,1.5vw,26px)] flex items-start gap-3">
            <input
              id={`${id}-call`}
              name="call"
              type="checkbox"
              className="mt-[2px] size-[20px] shrink-0 cursor-pointer appearance-none rounded-[2px] border border-lime bg-[#F0F0F0] checked:bg-lime"
            />
            <label htmlFor={`${id}-call`} className="text-muted">
              {trialRequest.call}
            </label>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-[clamp(18px,1.5vw,26px)] inline-flex cursor-pointer items-center gap-2.5 rounded-lg bg-lime px-[clamp(30px,3vw,52px)] py-[clamp(12px,1vw,16px)] font-display text-[clamp(16px,1.2vw,22px)] font-semibold text-white transition-colors hover:bg-[#A6B534] disabled:opacity-60"
          >
            {pending ? "Sending…" : trialRequest.submit}
            <Image src="/img/icon-arrow-white.svg" alt="" width={14} height={15} />
          </button>

          {state.status !== "idle" && (
            <p
              role="status"
              className={cx("mt-4", state.status === "success" ? "text-green-brand" : "text-kmep")}
            >
              {state.message}
            </p>
          )}

          <p className="mt-[clamp(14px,1.2vw,20px)] max-w-[620px] text-muted">
            {trialRequest.privacy.before}
            <a href="/privacy" className="text-lime">
              {trialRequest.privacy.link}
            </a>
            {trialRequest.privacy.after}
          </p>
        </form>
      </Reveal>
    </section>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[clamp(8px,0.7vw,12px)]">
      <label htmlFor={id} className="font-semibold text-muted">
        {label}
      </label>
      {children}
      {error && <p className="text-small text-kmep">{error}</p>}
    </div>
  );
}
