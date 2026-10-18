import type { ReactNode } from "react";
import { Image as ImageIcon, Link as LinkIcon, MessageSquare } from "lucide-react";
import { QrArt, Sparkle } from "@/components/brand/art";
import { MIN_LIST_ITEMS } from "@giftqr/shared";
import { cn } from "@/lib/utils";
import styles from "./landing.module.css";

function Step({
  n,
  title,
  body,
  art,
  reveal,
}: {
  n: number;
  title: string;
  body: string;
  art: ReactNode;
  reveal: string;
}) {
  // The reveal sits on a wrapper: a finished animation would otherwise hold the
  // card's transform and cancel its hover lift.
  return (
    <div className={reveal}>
      <article className={cn(styles.step, "h-full")}>
        <div className="relative mb-6 flex h-[170px] flex-col items-center justify-center gap-2 rounded-[20px] bg-paper">
          {art}
        </div>
        <span className="inline-grid h-11 w-11 place-items-center rounded-full bg-plum font-display text-xl font-extrabold text-gold">
          {n}
        </span>
        <h3 className="mb-2 mt-3.5 font-display text-[28px] font-extrabold tracking-display">{title}</h3>
        <p className="m-0 text-[17px] leading-relaxed text-plum-body">{body}</p>
      </article>
    </div>
  );
}

const chip = "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold";

export function HowItWorks() {
  return (
    <section id="how" className="relative bg-blush py-[90px]">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-8">
        <div className="mx-auto mb-16 flex max-w-[720px] flex-col items-center gap-4 text-center">
          <span className="scroll-rise text-sm font-bold uppercase tracking-[.12em] text-ribbon-deep">How it works</span>
          <h2 className="scroll-rise m-0 font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-none tracking-display">
            From idea to unwrapped in three steps
          </h2>
        </div>
        <div className="relative">
          <svg
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute left-[8%] top-[92px] z-0 hidden h-[60px] w-[84%] md:block"
          >
            <path
              className={styles.dashLine}
              d="M0 30 C 200 -10, 400 70, 600 30 S 1000 -10, 1200 30"
              fill="none"
              stroke="#D6284A"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="relative z-[1] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8">
            <Step
              n={1}
              reveal="scroll-rise"
              title="Create a list"
              body="Give it a name for the moment: a birthday, an anniversary, or just because."
              art={
                <div className="flex min-w-[210px] items-center gap-1 rounded-[14px] border-2 border-plum bg-white px-4 py-3 text-xl font-semibold">
                  <span className={styles.typing}>Mom&apos;s 60th</span>
                  <span className={styles.caret} />
                </div>
              }
            />
            <Step
              n={2}
              reveal="scroll-rise-2"
              title="Pack it with surprises"
              body={`Add links, messages and photos. Pack at least ${MIN_LIST_ITEMS} to unlock your code.`}
              art={
                <>
                  <span className={cn(styles.dropItem, chip, "bg-ribbon text-white")}>
                    <LinkIcon size={14} strokeWidth={2.5} aria-hidden="true" />
                    youtube.com/our-dance
                  </span>
                  <span className={cn(styles.dropItem, chip, "bg-gold text-plum")} style={{ animationDelay: ".35s" }}>
                    <MessageSquare size={14} strokeWidth={2.5} aria-hidden="true" />
                    &ldquo;Proud of you, always&rdquo;
                  </span>
                  <span className={cn(styles.dropItem, chip, "bg-plum text-white")} style={{ animationDelay: ".7s" }}>
                    <ImageIcon size={14} strokeWidth={2.5} aria-hidden="true" />
                    beach-day.jpg
                  </span>
                </>
              }
            />
            <Step
              n={3}
              reveal="scroll-rise-3"
              title="Unlock and share"
              body="Pay for what you packed, get your QR code, and tuck it into a card, a sign or the gift box."
              art={
                <>
                  <div className={cn(styles.stampLoop, "rounded-2xl border-2 border-plum bg-white p-2.5 shadow-hard-sm")}>
                    <QrArt size={100} />
                  </div>
                  <Sparkle size={26} className="absolute right-[22%] top-[18%] animate-twinkle" />
                  <Sparkle
                    size={18}
                    fill="#FF5A6E"
                    className="absolute bottom-[18%] left-[22%] animate-twinkle"
                    style={{ animationDelay: ".9s" }}
                  />
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
