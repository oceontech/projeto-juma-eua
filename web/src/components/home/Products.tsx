import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { cx } from "@/components/ui";
import { products } from "@/content/home";

/** Os dois produtos da v1, lado a lado, sobre a faixa vermelho/azul. */
export function Products() {
  return (
    <section id="products" className="relative overflow-hidden bg-white py-[clamp(60px,6.5vw,124px)]">
      {/* A faixa que sangra atrás dos cards. Vive só no desktop, como no
          layout — no mobile o Figma a esconde. */}
      <Image
        src="/img/products-gradient.svg"
        alt=""
        aria-hidden
        width={1920}
        height={462}
        className="absolute top-[33.4%] left-0 h-[45.3%] w-full max-[860px]:hidden"
      />

      <div className="relative mx-auto grid w-[min(1199px,calc(100%-2*var(--spacing-gut)))] grid-cols-1 gap-[clamp(20px,3.25vw,62px)] min-[861px]:grid-cols-2">
        {products.map((product, i) => {
          const kmep = product.id === "kmep";

          return (
            <Reveal
              key={product.id}
              as="article"
              delay={i * 0.1}
              className={cx(
                "relative flex flex-col overflow-hidden rounded-[clamp(14px,1.1vw,21px)] px-[clamp(20px,2.1vw,40px)] pt-[clamp(20px,2.15vw,41px)] pb-[clamp(20px,2.5vw,47px)] text-white",
                kmep
                  ? "bg-linear-[158.24deg,#000_39.81%,#4E1D15_94.16%]"
                  : "bg-linear-[158.24deg,#000_39.81%,var(--color-amino)_94.16%]",
              )}
            >
              <p className="flex items-center">
                <span
                  className={cx(
                    "text-[clamp(8px,0.73vw,14px)] tracking-[0.03em] whitespace-nowrap uppercase",
                    kmep ? "text-kmep-light" : "text-[#F3F3F3]",
                  )}
                >
                  {product.category}
                </span>
                <i
                  className={cx(
                    "ml-3.5 h-[2.6px] flex-1 rounded-[27px]",
                    kmep ? "bg-kmep" : "bg-white",
                  )}
                />
              </p>

              <h3 className="mt-[clamp(18px,2vw,39px)] mb-[clamp(10px,1.2vw,22px)] text-[clamp(26px,3.15vw,60px)] leading-none text-[#FAFBFC]">
                {product.title}
              </h3>

              <p className="max-w-[40ch] text-small leading-[1.56] text-[#E9E9E9]">
                {product.body}
              </p>

              <div className="relative my-[clamp(14px,1.6vw,30px)] mb-[clamp(16px,1.9vw,36px)]">
                {/* Bolinha de acento atrás do frasco. */}
                <span
                  aria-hidden
                  className={cx(
                    "absolute z-0 aspect-square w-[19%] rounded-full",
                    kmep ? "top-[20%] left-[3%] bg-kmep" : "top-[4%] left-0 bg-white",
                  )}
                />
                <Image
                  src={product.image.src}
                  alt={product.image.alt}
                  width={640}
                  height={640}
                  className="relative z-1 w-full"
                />
              </div>

              <Link
                href={product.href}
                aria-label={`Watch the ${product.title} video`}
                className={cx(
                  "relative mt-auto grid aspect-[485/271] place-items-center rounded-[14px] border-[1.3px] transition-transform hover:scale-[1.012]",
                  kmep
                    ? "border-kmep-light bg-kmep"
                    : "border-[#E8E8E8] bg-[#D3D3D3]",
                )}
              >
                <span
                  aria-hidden
                  className={cx(
                    "aspect-[69/83] w-[clamp(28px,3.6vw,69px)] rounded-[4px] [clip-path:polygon(0_0,100%_50%,0_100%)]",
                    kmep ? "bg-kmep-light" : "bg-white",
                  )}
                />
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
