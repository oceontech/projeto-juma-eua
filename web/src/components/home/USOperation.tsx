import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Pill } from "@/components/ui";
import { TrialForm } from "./TrialForm";
import { getContent } from "@/lib/locale";
import s from "./USOperation.module.css";

/**
 * Onde o lead entra: um card pai verde sobre a foto da faixa de teste, com a
 * conversa à esquerda — o que é, onde fica a LLC, outros caminhos — e o
 * formulário num card branco à direita.
 */
export async function USOperation() {
  const { usOperation } = (await getContent()).home;
  const { contact, alternatives } = usOperation;

  return (
    <section id="us-operation" className={s.section}>
      <div className={s.card}>
        <Image
          src="/img/trial-v2/step-2-check.webp"
          alt=""
          aria-hidden
          fill
          sizes="(max-width: 860px) 100vw, 1400px"
          className={s.photo}
        />
        <div className={s.shade} aria-hidden />

        <Reveal replay y={26} stagger={0.09} targetSelector="[data-us-item]" className={s.info}>
          <div data-us-item>
            <Pill>{usOperation.eyebrow}</Pill>
          </div>
          <h2 data-us-item className={s.headline}>
            {usOperation.headline}
          </h2>
          <p data-us-item className={s.body}>
            {usOperation.body}
          </p>

          <div data-us-item className={s.contact}>
            <span aria-hidden className={s.contactIcon}>
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
            <div>
              <p className={s.contactName}>{contact.name}</p>
              <p className={s.contactAddress}>
                {contact.address.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </p>
              <p className={s.contactBody}>{contact.body}</p>
            </div>
          </div>

          <div data-us-item className={s.alternatives}>
            <p className={s.altTitle}>{alternatives.title}</p>
            <div className={s.altActions}>
              {alternatives.actions.map((action) => (
                <a key={action.id} href={action.href} className={s.altAction}>
                  <Image src={action.icon} alt="" width={45} height={45} className={s.altIcon} />
                  <span>{action.label}</span>
                  <svg aria-hidden viewBox="0 0 20 20" fill="none">
                    <path d="M6 14 14 6M7 6h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
            <p className={s.altNote}>{alternatives.disclaimer}</p>
          </div>
        </Reveal>

        <Reveal replay y={40} blur={10} delay={0.1} className={s.formCard}>
          <TrialForm />
        </Reveal>
      </div>
    </section>
  );
}
