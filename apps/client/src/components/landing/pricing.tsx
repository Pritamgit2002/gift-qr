import { Plus } from "lucide-react";
import { ITEM_PRICES, MIN_LIST_PRICE } from "@giftqr/shared";
import { cn } from "@/lib/utils";
import { PriceCalculator } from "./price-calculator";
import styles from "./landing.module.css";

const chips = [
  { label: "Link", price: ITEM_PRICES.link, gold: false, tilt: 0 },
  { label: "Message", price: ITEM_PRICES.message, gold: true, tilt: -2 },
  { label: "Photo", price: ITEM_PRICES.image, gold: false, tilt: 0 },
];

export function Pricing({ startHref }: { startHref: string }) {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-14 px-4 sm:px-8">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-[22px]">
          <span className="scroll-rise text-sm font-bold uppercase tracking-[.12em] text-ribbon-deep">Pricing</span>
          <h2 className="scroll-rise m-0 font-display text-[clamp(38px,5vw,64px)] font-extrabold leading-none tracking-display">
            Pay only for what you pack.
          </h2>
          <p className="scroll-rise-2 m-0 max-w-[480px] text-[19px] leading-relaxed text-plum-body">
            No plans, no subscriptions. A list unlocks its QR code once it has at least five items and comes to more
            than ₹{MIN_LIST_PRICE}.
          </p>
          <div className="scroll-rise-3 flex flex-wrap gap-3.5">
            {chips.map((chip) => (
              <div
                key={chip.label}
                className={cn(
                  styles.priceChip,
                  "min-w-[130px] rounded-[20px] border-2 border-plum px-5 py-4 shadow-hard-sm",
                  chip.gold ? "bg-gold" : "bg-white"
                )}
                style={chip.tilt ? { transform: `rotate(${chip.tilt}deg)` } : undefined}
              >
                <span className={cn("block text-sm font-semibold", chip.gold ? "text-plum" : "text-plum-body")}>
                  {chip.label}
                </span>
                <span className="font-display text-4xl font-extrabold">₹{chip.price}</span>
              </div>
            ))}
          </div>
          <p className="m-0 flex max-w-[480px] items-start gap-2.5 text-base leading-[1.55] text-plum-body">
            <Plus size={22} strokeWidth={2.4} className="mt-px flex-none text-ribbon-deep" aria-hidden="true" />
            Thought of something later? New items go into a draft. Pay for the draft and they join the same QR code.
          </p>
        </div>

        <PriceCalculator startHref={startHref} />
      </div>
    </section>
  );
}
