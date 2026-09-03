import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { footer } from "@/content/home";

/** Rodapé sobre a paisagem — o último bloco do layout. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white pt-[clamp(40px,4vw,76px)]">
      <Image
        src="/img/footer-landscape.jpg"
        alt=""
        aria-hidden
        width={1920}
        height={1081}
        className="absolute bottom-0 left-0 z-0 w-full"
      />

      <div className="wrap relative z-1">
        <div className="grid grid-cols-1 gap-[clamp(24px,2vw,40px)] min-[861px]:grid-cols-2 min-[1101px]:grid-cols-[440fr_244fr_310fr_119fr]">
          <div className="min-[861px]:col-span-2 min-[1101px]:col-span-1">
            <strong className="font-display text-[clamp(20px,1.68vw,32px)] font-semibold">
              {footer.brand.name}{" "}
              <span className="text-[0.75em] font-normal">
                {footer.brand.suffix}
              </span>
            </strong>
            <p className="mt-[clamp(14px,1.4vw,26px)] text-muted">{footer.address}</p>
            <p className="mt-[1.5em] text-muted">{footer.parent}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h4 className="mb-[clamp(14px,1.5vw,28px)] font-display text-[clamp(11px,1.05vw,20px)] font-semibold tracking-[0.05em] text-lime uppercase">
                {column.title}
              </h4>
              <ul className="m-0 list-none p-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      className="block py-0.5 text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[clamp(34px,3.6vw,70px)] flex flex-col items-start justify-between gap-6 border-t border-ink/15 pt-[clamp(30px,3.2vw,60px)] pb-[clamp(180px,25vw,480px)] text-muted min-[861px]:flex-row min-[861px]:items-end">
          <p className="max-w-[555px]">{footer.disclaimer}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
