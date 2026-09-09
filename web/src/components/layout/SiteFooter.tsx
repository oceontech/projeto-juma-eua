import Image from "next/image";
import { SmartLink } from "@/components/ui/SmartLink";
import { footer } from "@/content/home";

/** Rodapé sobre a paisagem — o último bloco do layout. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white pt-[clamp(34px,3vw,54px)]">
      <Image
        src="/img/footer-landscape.webp"
        alt=""
        aria-hidden
        width={1920}
        height={1081}
        className="absolute bottom-0 left-0 z-0 h-[170px] w-full object-cover object-bottom [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)] [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%)] min-[861px]:h-[clamp(320px,20vw,380px)]"
      />

      <div className="wrap relative z-1">
        <div className="grid grid-cols-2 gap-x-[clamp(20px,2vw,34px)] gap-y-[clamp(24px,2vw,34px)] min-[861px]:grid-cols-4 min-[1101px]:grid-cols-[440fr_244fr_310fr_119fr]">
          <div className="col-span-2 min-[861px]:col-span-1">
            <strong className="font-display text-[clamp(18px,1.4vw,26px)] font-semibold">
              {footer.brand.name}{" "}
              <span className="text-[0.75em] font-normal">
                {footer.brand.suffix}
              </span>
            </strong>
            <p className="mt-[clamp(10px,0.9vw,16px)] text-small leading-[1.45] text-muted">{footer.address}</p>
            <p className="mt-[0.8em] text-small leading-[1.45] text-muted">{footer.parent}</p>
          </div>

          {footer.columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h4 className="mb-[clamp(10px,1vw,16px)] font-display text-[clamp(11px,0.85vw,16px)] font-semibold tracking-[0.05em] text-lime uppercase">
                {column.title}
              </h4>
              <ul className="m-0 list-none p-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      className="block py-0.5 text-small leading-[1.45] text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-[clamp(26px,2.4vw,42px)] flex flex-col items-start justify-between gap-3 border-t border-ink/15 pt-[clamp(20px,2vw,34px)] pb-[170px] text-small leading-[1.45] text-muted min-[861px]:flex-row min-[861px]:items-end min-[861px]:pb-[clamp(320px,20vw,380px)]">
          <p className="max-w-[555px]">{footer.disclaimer}</p>
          <p className="whitespace-nowrap">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
