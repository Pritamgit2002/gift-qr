"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { ITEM_PRICES, priceOf } from "@giftqr/shared";
import { buttonVariants } from "@/components/brand/button";
import { Sparkle } from "@/components/brand/art";
import { itemCount, itemsMissing } from "@/lib/pricing";
import styles from "./landing.module.css";

type Kind = "links" | "messages" | "images" | "audios";

const rows: { kind: Kind; label: string; one: string; each: number }[] = [
  { kind: "links", label: "Links", one: "link", each: ITEM_PRICES.link },
  { kind: "messages", label: "Messages", one: "message", each: ITEM_PRICES.message },
  { kind: "images", label: "Photos", one: "photo", each: ITEM_PRICES.image },
  { kind: "audios", label: "Audio clips", one: "audio clip", each: ITEM_PRICES.audio },
];

/** "Pack your gift": change the counts, see what the server would charge. */
export function PriceCalculator({ startHref }: { startHref: string }) {
  const [counts, setCounts] = useState<Record<Kind, number>>({ links: 2, messages: 2, images: 0, audios: 0 });
  const price = priceOf("list", {
    links: new Array(counts.links),
    messages: new Array(counts.messages),
    images: new Array(counts.images),
    audios: new Array(counts.audios),
  });
  const missing = itemsMissing(price);

  const bump = (kind: Kind, by: number) =>
    setCounts((c) => ({ ...c, [kind]: Math.max(0, Math.min(50, c[kind] + by)) }));

  return (
    <div className="scroll-pop relative min-w-0 flex-[1_1_420px] overflow-hidden rounded-[36px] bg-plum p-9 text-paper">
      <Sparkle size={160} className="absolute -right-10 -top-10 animate-spin-slow opacity-[.14]" />
      <h3 className="mb-1.5 mt-0 font-display text-[28px] font-extrabold tracking-display">Pack your gift</h3>
      <p className="mb-6 mt-0 text-plum-mist">Change the counts to see the price.</p>
      <div className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <div
            key={row.kind}
            className="flex items-center justify-between gap-3 rounded-[20px] bg-white/[.07] py-2.5 pl-[18px] pr-2.5"
          >
            <span className="font-semibold">
              {row.label} <span className="font-normal text-plum-mist">· ₹{row.each} each</span>
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-paper p-1">
              <button
                className={styles.stepButton}
                type="button"
                aria-label={`Remove ${row.kind === "audios" ? "an" : "a"} ${row.one}`}
                onClick={() => bump(row.kind, -1)}
              >
                <Minus size={16} strokeWidth={3} aria-hidden="true" />
              </button>
              <span className="min-w-8 text-center font-bold text-plum" aria-live="polite">
                {counts[row.kind]}
              </span>
              <button
                className={styles.stepButton}
                type="button"
                aria-label={`Add ${row.kind === "audios" ? "an" : "a"} ${row.one}`}
                onClick={() => bump(row.kind, 1)}
              >
                <Plus size={16} strokeWidth={3} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-end justify-between gap-4 border-t border-dashed border-white/25 pt-6">
        <div>
          <span className="block text-[15px] text-plum-mist">{itemCount(price)} items · total</span>
          {/* The key replays the pop each time the total changes. */}
          <span key={price.amount} className={`${styles.numberPop} font-display text-[64px] font-extrabold leading-none text-gold`}>
            ₹{price.amount}
          </span>
        </div>
        {missing ? (
          <span className="inline-flex min-h-[52px] items-center rounded-full border-2 border-dashed border-white/40 px-[22px] font-semibold text-paper">
            Add {missing} more to unlock
          </span>
        ) : (
          <Link className={buttonVariants({ variant: "gold", size: "lg" })} href={startHref}>
            Unlock my QR
          </Link>
        )}
      </div>
    </div>
  );
}
