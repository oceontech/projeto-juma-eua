"use client";

import Image from "next/image";
import { useActionState, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { submitTrialRequest, type TrialRequestState } from "@/lib/actions";
import { useContent } from "@/components/layout/LocaleProvider";
import { cx } from "@/components/ui";
import { CropIcon } from "./CropIcon";
import s from "./TrialForm.module.css";

const INITIAL: TrialRequestState = { status: "idle", message: "", errors: {} };

/* As fichas de cultura são as da seção de timing do KMEP (mesmos ids, mesmos
   rótulos nos dois idiomas), cada uma com o seu recorte de estúdio. */
const CROP_ICONS: Record<string, string> = {
  citrus: "citrus",
  fruit: "tree-fruit",
  veg: "vegetables",
  tomato: "tomato-pepper",
  ornamental: "ornamentals",
  potato: "potato",
  onion: "onion-garlic",
  roots: "carrot-beet",
  corn: "corn",
  soy: "soybean",
  cotton: "cotton",
  beans: "beans",
};

/**
 * Formulário do pedido de faixa de teste.
 *
 * useActionState liga o form ao Server Action: o envio funciona antes do
 * JavaScript carregar, e depois dele vira uma transição sem recarregar a
 * página. Os nomes dos campos são o contrato com `submitTrialRequest` —
 * cultura e área viraram fichas e segmentos, mas continuam `crop` e `acres`.
 *
 * `compact` é a variante reduzida das LPs: nome, e-mail, estado e cultura.
 * Os campos que saem chegam vazios ao action, que já os trata como opcionais —
 * o contrato não muda. As culturas são as mesmas nas três páginas.
 */
export function TrialForm({
  source,
  compact = false,
}: {
  source?: string;
  compact?: boolean;
}) {
  const content = useContent();
  const { form } = content.home.usOperation;
  const cropOptions = content.kmep.timing.crops;
  const [state, action, pending] = useActionState(submitTrialRequest, INITIAL);
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate className={s.form}>
      {source && <input type="hidden" name="source" value={source} />}
      <div data-trial-item className={s.head}>
        <p className={s.heading}>{form.heading}</p>
        <p className={s.caption}>{form.caption}</p>
      </div>

      <div className={s.grid}>
        <TextField
          id={`${id}-name`}
          name="name"
          label={form.name.label}
          placeholder={form.name.placeholder}
          autoComplete="name"
          error={state.errors.name}
        />
        {!compact && (
          <TextField
            id={`${id}-company`}
            name="company"
            label={form.company.label}
            placeholder={form.company.placeholder}
            autoComplete="organization"
          />
        )}
        <TextField
          id={`${id}-email`}
          name="email"
          type="email"
          label={form.email.label}
          placeholder={form.email.placeholder}
          autoComplete="email"
          error={state.errors.email}
        />
        <div data-trial-item className={s.field}>
          <label htmlFor={`${id}-state`} className={s.label}>
            {form.state.label}
          </label>
          <Select id={`${id}-state`} name="state" options={form.state.options} />
        </div>
      </div>

      <fieldset data-trial-item className={s.fieldset}>
        <legend className={s.label}>{form.crop.label}</legend>
        <div className={s.chips}>
          {cropOptions.map((option, i) => (
            <label key={option.id} className={s.chip}>
              <input type="radio" name="crop" value={option.label} defaultChecked={i === 0} className={s.srOnly} />
              <span className={s.chipFace}>
                {CROP_ICONS[option.id] ? (
                  <CropIcon id={CROP_ICONS[option.id]} className={s.chipIcon} />
                ) : (
                  <span aria-hidden className={s.chipDot} />
                )}
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {!compact && (
        <fieldset data-trial-item className={s.fieldset}>
          <legend className={s.label}>{form.acres.label}</legend>
          <div className={s.segments} style={{ "--n": form.acres.options.length } as CSSProperties}>
            {form.acres.options.map((option, i) => (
              <label key={option} className={s.segment}>
                <input type="radio" name="acres" value={option} defaultChecked={i === 0} className={s.srOnly} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {!compact && (
        <div data-trial-item className={s.field}>
          <label htmlFor={`${id}-problem`} className={s.label}>
            {form.problem.label}
          </label>
          <textarea
            id={`${id}-problem`}
            name="problem"
            placeholder={form.problem.placeholder}
            className={cx(s.input, s.textarea)}
          />
        </div>
      )}

      {!compact && (
        <label data-trial-item className={s.toggle}>
          <input type="checkbox" name="call" className={s.srOnly} />
          <span aria-hidden className={s.switch}>
            <span className={s.knob} />
          </span>
          <span className={s.toggleText}>{form.call}</span>
        </label>
      )}

      <div data-trial-item className={s.actions}>
        <button type="submit" disabled={pending} className={s.submit}>
          <span>{pending ? form.sending : form.submit}</span>
          <span aria-hidden className={s.submitArrow}>
            <svg viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {state.status !== "idle" && (
          <p role="status" className={cx(s.status, state.status === "success" ? s.success : s.failure)}>
            <span aria-hidden className={s.statusIcon}>
              {state.status === "success" ? "✓" : "!"}
            </span>
            {state.message}
          </p>
        )}

        <p className={s.privacy}>
          {form.privacy.before}
          <a href="#">{form.privacy.link}</a>
          {form.privacy.after}
        </p>
      </div>
    </form>
  );
}

function TextField({
  id,
  name,
  label,
  placeholder,
  type = "text",
  autoComplete,
  error,
}: {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div data-trial-item className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={s.input}
      />
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
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
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
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
        if (!open) openDropdown();
        else setActiveIndex((current) => (current + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openDropdown();
        else setActiveIndex((current) => (current - 1 + options.length) % options.length);
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
        if (open) selectOption(activeIndex);
        else openDropdown();
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
        className={cx(s.input, "custom-select__trigger")}
        onClick={() => (open ? setOpen(false) : openDropdown())}
        onKeyDown={handleKeyDown}
      >
        <span className="truncate">{value}</span>
        <Image src="/img/icon-chevron.svg" alt="" width={13} height={8} className="custom-select__chevron" />
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
          return (
            <button
              key={option}
              id={`${id}-option-${index}`}
              type="button"
              role="option"
              aria-selected={selected}
              data-active={index === activeIndex}
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
