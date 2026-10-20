/** What is being paid for: an unpaid list, or the draft of extra items for a paid list. */
export type PaymentTarget = "list" | "draft";

/** Rupees charged per item. */
export const ITEM_PRICES = { link: 1, message: 1, image: 2, audio: 2 } as const;

/** A list can be paid for once it has at least this many items. */
export const MIN_LIST_ITEMS = 5;

export type Price = {
  links: number;
  messages: number;
  images: number;
  audios: number;
  /** In rupees. */
  amount: number;
  /** Why this can't be paid for yet, or null when it can. */
  blocker: string | null;
};

type Items = {
  links?: readonly unknown[];
  messages?: readonly unknown[];
  images?: readonly unknown[];
  audios?: readonly unknown[];
};

/**
 * What the items of a list or draft cost. The server charges exactly this, so
 * the client can show it before checkout.
 */
export function priceOf(target: PaymentTarget, items: Items): Price {
  const links = items.links?.length ?? 0;
  const messages = items.messages?.length ?? 0;
  const images = items.images?.length ?? 0;
  const audios = items.audios?.length ?? 0;
  const amount =
    links * ITEM_PRICES.link +
    messages * ITEM_PRICES.message +
    images * ITEM_PRICES.image +
    audios * ITEM_PRICES.audio;
  const count = links + messages + images + audios;

  let blocker: string | null = null;
  if (target === "draft") {
    if (count === 0) blocker = "Add at least one item to pay for";
  } else if (count < MIN_LIST_ITEMS) {
    blocker = `A list needs at least ${MIN_LIST_ITEMS} items before you can pay for it`;
  }
  return { links, messages, images, audios, amount, blocker };
}

/** A Razorpay order. The server stores it on the list or draft it was created for. */
export type PaymentOrder = {
  id: string;
  /** In paise, as Razorpay charges it. */
  amount: number;
  currency: string;
};

/** What Razorpay Checkout hands the page after a payment; send it on to confirm the payment. */
export type CheckoutPayment = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
