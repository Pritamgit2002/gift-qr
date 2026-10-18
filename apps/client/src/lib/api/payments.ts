import type { PaymentOrder } from "@giftqr/shared";
import { request } from "./client";

export const createOrder = (order: {
  /** In rupees. */
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}) => request<PaymentOrder>("/payments/orders", { method: "POST", json: order });

export const verifyPayment = (payment: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => request("/payments/verify", { method: "POST", json: payment });
