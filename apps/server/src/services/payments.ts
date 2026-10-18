import { createHmac, timingSafeEqual } from "node:crypto";
import type { CheckoutPayment, PaymentOrder } from "@giftqr/shared";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";
import { logger } from "../lib/logger.js";
import { getRazorpay } from "../lib/razorpay.js";

/**
 * Creates a Razorpay order for `rupees`. Only the list and draft services call
 * this, with a price they worked out from stored items, and they store the
 * order on what it pays for.
 */
export async function createOrder(rupees: number, notes: Record<string, string>): Promise<PaymentOrder> {
  try {
    const order = await getRazorpay().orders.create({
      amount: rupees * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes,
    });
    return { id: order.id, amount: Number(order.amount), currency: order.currency };
  } catch (error) {
    // Razorpay rejects with plain objects, not Error instances.
    await logger({ error: JSON.stringify(error) });
    throw new HttpError(502, "Could not create payment order");
  }
}

function hasValidSignature(payment: CheckoutPayment) {
  const expected = createHmac("sha256", env.razorpay.keySecret)
    .update(`${payment.razorpay_order_id}|${payment.razorpay_payment_id}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(payment.razorpay_signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Checks that `payment` settled `order`, the order stored on the list or draft:
 * it is for that order, Razorpay signed it, and Razorpay holds a successful
 * payment for the order's full amount. Returns the Razorpay payment id.
 */
export async function verifyPayment(order: PaymentOrder, payment: CheckoutPayment): Promise<string> {
  if (payment.razorpay_order_id !== order.id) {
    throw new HttpError(400, "This payment is for a different order");
  }
  if (!hasValidSignature(payment)) {
    throw new HttpError(400, "Invalid payment signature");
  }

  let paid;
  try {
    paid = await getRazorpay().payments.fetch(payment.razorpay_payment_id);
  } catch (error) {
    await logger({ error: JSON.stringify(error) });
    throw new HttpError(502, "Could not check the payment with Razorpay");
  }
  // "authorized" is a successful payment that Razorpay has yet to auto-capture.
  if (
    paid.order_id !== order.id ||
    Number(paid.amount) !== order.amount ||
    paid.currency !== order.currency ||
    (paid.status !== "captured" && paid.status !== "authorized")
  ) {
    throw new HttpError(400, "Payment is not complete for this order");
  }
  return paid.id;
}
