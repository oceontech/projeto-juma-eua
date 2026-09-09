"use client";

import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState } from "react";
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
      <div className="grid grid-cols-2 gap-x-[clamp(12px,1vw,20px)] gap-y-[clamp(14px,1vw,20px)]">
        <Field
          id={`${id}-name`}
          label={form.name.label}
          error={state.errors.name}
          className="col-span-2 min-[861px]:col-span-1"
        >
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={form.name.placeholder}
            className="field-input"
          />
        </Field>

        <Field
          id={`${id}-company`}
          label={form.company.label}
          className="col-span-2 min-[861px]:col-span-1"
        >
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

        <Field
          id={`${id}-acres`}
          label={form.acres.label}
          className="col-span-2 min-[861px]:col-span-1"
        >
          <Select id={`${id}-acres`} name="acres" options={form.acres.options} />
        </Field>

        <Field
          id={`${id}-email`}
          label={form.email.label}
          error={state.errors.email}
          className="col-span-2 min-[861px]:col-span-1"
        >
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
          className="col-span-2"
        >
          <textarea
            id={`${id}-problem`}
            name="problem"
            placeholder={form.problem.placeholder}
            className="field-input min-h-[112px] resize-y min-[861px]:min-h-[128px]"
          />
        </Field>
      </div>

      <div
        data-trial-item=""
        className="mt-[clamp(18px,1.5vw,26px)] flex items-start gap-3"
      >
        <input
          id={`${id}-call`}
          name="call"
          type="checkbox"
          className="mt-[2px] size-[18px] shrink-0 cursor-pointer appearance-none rounded-[2px] border border-lime bg-[#F0F0F0] checked:bg-lime"
        />
        <label htmlFor={`${id}-call`} className="text-small text-muted">
          {form.call}
        </label>
      </div>

      <button
        data-trial-item=""
        type="submit"
        disabled={pending}
        className="mt-[clamp(18px,1.5vw,26px)] inline-flex cursor-pointer items-center gap-2.5 rounded-lg bg-lime px-[clamp(30px,3vw,52px)] py-[clamp(11px,0.8vw,14px)] font-display text-[clamp(15px,1.05vw,20px)] font-semibold text-white transition-colors hover:bg-[#A6B534] disabled:opacity-60"
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

      <p
        data-trial-item=""
        className="mt-[clamp(14px,1.2vw,20px)] max-w-[620px] text-small leading-[1.45] text-muted"
      >
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
    <div
      data-trial-item=""
      className={cx("flex flex-col gap-[clamp(6px,0.55vw,10px)]", className)}
    >
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
  const [value, setValue] = useState(options[0]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    function closeOnOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  function openDropdown() {
    setActiveIndex(options.indexOf(value));
    setOpen(true);
  }

  function selectOption(index: number) {
    setValue(options[index]);
    setActiveIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setActiveIndex((current) => (current + 1) % options.length);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          openDropdown();
        } else {
          setActiveIndex((current) => (current - 1 + options.length) % options.length);
        }
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActiveIndex(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) {
          selectOption(activeIndex);
        } else {
          openDropdown();
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div ref={rootRef} className="custom-select">
      <input type="hidden" name={name} value={value} />

      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
        data-open={open}
        className="field-input custom-select__trigger"
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className="truncate">{value}</span>
        <Image
          src="/img/icon-chevron.svg"
          alt=""
          width={13}
          height={8}
          className="custom-select__chevron"
        />
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-label={name}
        aria-hidden={!open}
        data-lenis-prevent=""
        data-open={open}
        className="custom-select__menu"
      >
        {options.map((option, index) => {
          const selected = option === value;
          const active = index === activeIndex;

          return (
            <button
              key={option}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={selected}
              data-active={active}
              data-selected={selected}
              tabIndex={-1}
              className="custom-select__option"
              onPointerMove={() => setActiveIndex(index)}
              onClick={() => selectOption(index)}
            >
              <span>{option}</span>
              <span aria-hidden className="custom-select__selected-mark" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
