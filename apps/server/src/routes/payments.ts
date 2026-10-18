import { Router } from "express";
import { ok, requireString } from "../lib/http.js";
import * as paymentService from "../services/payments.js";

export const paymentsRouter = Router();

const isRecord = (value: unknown): value is Record<string, string> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

paymentsRouter.post("/orders", async (req, res) => {
  const order = await paymentService.createOrder({
    amount: Number(req.body?.amount),
    currency: typeof req.body?.currency === "string" ? req.body.currency : "INR",
    receipt: typeof req.body?.receipt === "string" ? req.body.receipt : undefined,
    notes: isRecord(req.body?.notes) ? req.body.notes : undefined,
  });
  res.status(201).json(ok(order, "Order created"));
});

paymentsRouter.post("/verify", async (req, res) => {
  paymentService.verifyPayment({
    orderId: requireString(req.body?.razorpay_order_id, "razorpay_order_id"),
    paymentId: requireString(req.body?.razorpay_payment_id, "razorpay_payment_id"),
    signature: requireString(req.body?.razorpay_signature, "razorpay_signature"),
  });
  res.json(ok(undefined, "Payment verified successfully"));
});
