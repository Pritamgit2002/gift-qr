import type { CheckoutPayment, PaymentOrder, PaymentTarget } from "@giftqr/shared";
import { request } from "./client";

// Paying for a list, or for its draft once the list is paid. The server works
// out the price from what it has stored; use priceOf to show it beforehand.

/** Opens a Razorpay order to hand to the checkout widget. */
export const createOrder = (listName: string, target: PaymentTarget) =>
  request<PaymentOrder>("/payments/orders", { method: "POST", json: { listName, target } });

/** Passes on what the checkout widget returned. The server checks it, then marks the list paid or merges the draft. */
export const confirmPayment = (listName: string, target: PaymentTarget, payment: CheckoutPayment) =>
  request("/payments/confirm", { method: "POST", json: { listName, target, ...payment } });
