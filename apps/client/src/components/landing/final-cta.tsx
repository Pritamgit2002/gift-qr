import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/brand/button";
import { FallingConfetti } from "@/components/brand/confetti";
import { cn } from "@/lib/utils";
import styles from "./landing.module.css";

export function FinalCta({ startHref }: { startHref: string }) {
  return (
    <section className="pb-[90px]">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
        <div className="scroll-pop relative overflow-hidden rounded-[44px] border-2 border-plum bg-ribbon px-10 py-[72px] text-center text-white shadow-hard-lg">
          <FallingConfetti
            pieces={[
              { left: 6, color: "#FFC23D", duration: 7 },
              { left: 16, color: "#fff", duration: 9, delay: 2, round: true, width: 9, height: 9 },
              { left: 28, color: "#23142E", duration: 8, delay: 4 },
              { left: 72, color: "#FFC23D", duration: 7.5, delay: 1 },
              { left: 84, color: "#fff", duration: 9.5, delay: 3, round: true, width: 8, height: 8 },
              { left: 94, color: "#23142E", duration: 8.5, delay: 5 },
            ]}
          />
          <div className="relative flex flex-col items-center gap-[22px]">
            <svg className={styles.wiggle} width="96" height="96" viewBox="0 0 40 40" aria-hidden="true">
              <rect x="4" y="15" width="32" height="22" rx="5" fill="#FFF6F1" stroke="#23142E" strokeWidth="1.2" />
              <rect x="2" y="11" width="36" height="8" rx="3" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
              <rect x="17.5" y="11" width="5" height="26" fill="#23142E" />
              <path d="M20 11 C 14 3, 8 7, 12 11 Z" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
              <path d="M20 11 C 26 3, 32 7, 28 11 Z" fill="#FFC23D" stroke="#23142E" strokeWidth="1.2" />
            </svg>
            <h2 className="m-0 font-display text-[clamp(40px,6vw,80px)] font-extrabold leading-none tracking-display">
              Ready to wrap one?
            </h2>
            <p className="m-0 max-w-[520px] text-xl leading-normal text-[#FFF0F2]">
              It takes about as long as writing a card, and it lasts a lot longer.
            </p>
            <Link className={cn(buttonVariants({ variant: "gold", size: "xl" }), "group")} href={startHref}>
              Make your GiftQR
              <ArrowRight
                size={20}
                strokeWidth={2.5}
                aria-hidden="true"
                className="transition-transform duration-350 ease-pop group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
