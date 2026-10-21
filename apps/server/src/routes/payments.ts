import { Router, type Request } from "express";
import { currentUser } from "../middleware/auth.js";
import { HttpError, ok, requireString } from "../lib/http.js";
import * as draftService from "../services/drafts.js";
import * as listService from "../services/lists.js";

// Paying for a list or its draft: create an order, open Razorpay Checkout with
// it, then confirm. The server prices the order and marks things paid itself.
export const paymentsRouter = Router();

function targetOf(req: Request) {
  const target: unknown = req.body?.target;
  if (target !== "list" && target !== "draft") {
    throw new HttpError(400, 'target must be "list" or "draft"');
  }
  return {
    target,
    ownerEmail: currentUser(req).email,
    listName: requireString(req.body?.listName, "listName"),
  };
}

paymentsRouter.post("/orders", async (req, res) => {
  const { target, ownerEmail, listName } = targetOf(req);
  const order =
    target === "list"
      ? await listService.startCheckout(ownerEmail, listName)
      : await draftService.startCheckout(ownerEmail, listName);
  res.status(201).json(ok(order, "Order created"));
});

paymentsRouter.post("/confirm", async (req, res) => {
  const { target, ownerEmail, listName } = targetOf(req);
  const payment = {
    razorpay_order_id: requireString(req.body?.razorpay_order_id, "razorpay_order_id"),
    razorpay_payment_id: requireString(req.body?.razorpay_payment_id, "razorpay_payment_id"),
    razorpay_signature: requireString(req.body?.razorpay_signature, "razorpay_signature"),
  };
  if (target === "list") {
    await listService.confirmPayment(ownerEmail, listName, payment);
    res.json(ok(undefined, `${listName} is paid for`));
  } else {
    await draftService.confirmPayment(ownerEmail, listName, payment);
    res.json(ok(undefined, `Draft items added to ${listName}`));
  }
});
