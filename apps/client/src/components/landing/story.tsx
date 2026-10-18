import Image from "next/image";
import { Heart } from "@/components/brand/art";
import momentPhoto from "../../../public/images/pp.jpg";

export function Story() {
  return (
    <section id="story" className="bg-blush py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-14 px-4 sm:px-8">
        <div className="scroll-pop relative min-w-0 flex-[1_1_440px]">
          <Image
            src={momentPhoto}
            alt="A woman photographing a moment at home"
            className="block h-[440px] w-full rounded-[200px_200px_36px_36px] border-2 border-plum object-cover"
            sizes="(max-width: 960px) 100vw, 560px"
          />
          <div className="absolute -bottom-[30px] -right-2.5 grid h-[150px] w-[150px] place-items-center rounded-full border-2 border-plum bg-gold">
            <svg viewBox="0 0 150 150" width="150" height="150" aria-hidden="true" className="absolute inset-0 animate-spin-slow">
              <defs>
                <path id="story-badge-circle" d="M75 75 m -54 0 a 54 54 0 1 1 108 0 a 54 54 0 1 1 -108 0" />
              </defs>
              <text className="fill-plum font-sans text-[13.5px] font-bold tracking-[2.6px]">
                <textPath href="#story-badge-circle">EVERY SCAN TELLS A STORY • EVERY SCAN TELLS A STORY •</textPath>
              </text>
            </svg>
            <Heart size={40} fill="#D6284A" />
          </div>
        </div>
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[22px]">
          <span className="scroll-rise text-sm font-bold uppercase tracking-[.12em] text-ribbon-deep">Our story</span>
          <h2 className="scroll-rise m-0 font-display text-[clamp(38px,5vw,60px)] font-extrabold leading-none tracking-display">
            Gifts should keep saying something.
          </h2>
          <p className="scroll-rise-2 m-0 text-lg leading-[1.7] text-plum-body">
            We built GiftQR so anyone can turn the links, words and pictures that matter into one small, scannable gift,
            for a birthday, an anniversary, or a spontaneous thank-you.
          </p>
          <p className="scroll-rise-3 m-0 text-lg leading-[1.7] text-plum-body">
            Our hope is simple: every scan should tell a story, spark a feeling, and leave a memory behind.
          </p>
          <span className="scroll-rise-3 font-hand text-3xl font-bold text-ribbon-deep">— the GiftQR team</span>
        </div>
      </div>
    </section>
  );
}
