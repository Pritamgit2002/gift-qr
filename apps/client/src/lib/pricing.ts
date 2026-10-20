import { MIN_LIST_ITEMS, type Price } from "@giftqr/shared";

export const itemCount = (price: Price) => price.links + price.messages + price.images + price.audios;

/** How many more items a list needs before it can be paid for; 0 when it is ready. */
export function itemsMissing(price: Price): number {
  if (!price.blocker) return 0;
  return Math.max(MIN_LIST_ITEMS - itemCount(price), 1);
}

/** Progress toward unlocking, 0–100. */
export function unlockProgress(price: Price): number {
  const missing = itemsMissing(price);
  const have = itemCount(price);
  return missing ? Math.round((have / (have + missing)) * 100) : 100;
}

export const rupees = (amount: number) => `₹${amount}`;
