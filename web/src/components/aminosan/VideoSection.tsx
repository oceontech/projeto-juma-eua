import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Placeholder do vídeo institucional. Sem fonte de vídeo real no Figma —
 * quando o asset chegar, troca-se o miolo lima por um <video>/poster real
 * mantendo a moldura e o botão de play.
 */
export function VideoSection() {
  return (
    <section className="bg-black py-[clamp(40px,5vw,80px)]">
      <Reveal y={20} className="wrap">
        <button
          type="button"
          aria-label="Play the Aminosan story"
          className="mx-auto flex aspect-video w-full max-w-[762px] items-center justify-center rounded-[10px] bg-lime transition-transform hover:scale-[1.01]"
        >
          <Image src="/img/aminosan/icon-play.svg" alt="" width={87} height={87} className="size-[clamp(56px,7vw,87px)]" />
        </button>
      </Reveal>
    </section>
  );
}
