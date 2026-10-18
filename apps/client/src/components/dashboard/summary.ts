import { priceOf, type Price } from "@giftqr/shared";
import { itemCount, itemsMissing, unlockProgress } from "@/lib/pricing";
import type { GiftList } from "./use-gift-lists";

export type Tone = "live" | "ready" | "todo";

export type Summary = {
  links: number;
  messages: number;
  photos: number;
  /** What unlocking the list costs. */
  price: Price;
  /** Items still needed before it can be paid for; 0 when ready or paid. */
  missing: number;
  progress: number;
  /** What the waiting draft items cost, for a paid list. */
  draftPrice: Price | null;
  draftCount: number;
  status: string;
  tone: Tone;
};

export function summarize(list: GiftList): Summary {
  const price = priceOf("list", list);
  const draftPrice = list.draft ? priceOf("draft", list.draft) : null;
  const draftCount = draftPrice ? itemCount(draftPrice) : 0;
  const missing = list.paid ? 0 : itemsMissing(price);

  let status: string;
  let tone: Tone;
  if (list.paid) {
    status = draftCount ? "Live · draft" : "Live";
    tone = "live";
  } else if (!missing) {
    status = "Ready";
    tone = "ready";
  } else {
    status = `${missing} to go`;
    tone = "todo";
  }

  return {
    links: list.links.length + (list.draft?.links.length ?? 0),
    messages: list.messages.length + (list.draft?.messages.length ?? 0),
    photos: list.images.length + (list.draft?.images.length ?? 0),
    price,
    missing,
    progress: list.paid ? 100 : unlockProgress(price),
    draftPrice,
    draftCount,
    status,
    tone,
  };
}

export const toneClass: Record<Tone, string> = {
  live: "bg-mint text-mint-ink",
  ready: "bg-gold text-plum",
  todo: "bg-peach text-ribbon-dark",
};
