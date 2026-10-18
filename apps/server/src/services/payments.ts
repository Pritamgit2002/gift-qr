import { createHmac, timingSafeEqual } from "node:crypto";
import type { PaymentOrder } from "@giftqr/shared";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";
import { logger } from "../lib/logger.js";
import { getRazorpay } from "../lib/razorpay.js";

type CreateOrderInput = {
  /** In rupees; Razorpay wants paise. */
  amount: number;
  currency: string;
  receipt?: string;
  notes?: Record<string, string>;
};

export async function createOrder(input: CreateOrderInput): Promise<PaymentOrder> {
  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new HttpError(400, "amount must be a positive number");
  }
  try {
    const order = await getRazorpay().orders.create({
      amount: Math.round(input.amount * 100),
      currency: input.currency,
      receipt: input.receipt || `receipt_${Date.now()}`,
      notes: input.notes ?? {},
    });
    return { id: order.id, amount: order.amount, currency: order.currency, receipt: order.receipt };
  } catch (error) {
    // Razorpay rejects with plain objects, not Error instances.
    await logger({ error: JSON.stringify(error) });
    throw new HttpError(502, "Could not create payment order");
  }
}

export function verifyPayment(input: { orderId: string; paymentId: string; signature: string }) {
  const expected = createHmac("sha256", env.razorpay.keySecret)
    .update(`${input.orderId}|${input.paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(input.signature);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new HttpError(400, "Invalid payment signature");
  }
}
