import type { CheckoutPayment, PaymentTarget } from "@giftqr/shared";
import { confirmPayment, createOrder } from "@/lib/api/payments";
import { loadScript } from "@/utils/razorpayScript";

const CHECKOUT_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayWidget = {
  open(): void;
  on(event: "payment.failed", handler: (response: { error: { description: string } }) => void): void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayWidget;
  }
}

export type CheckoutOutcome =
  | { status: "paid"; message?: string }
  | { status: "dismissed" }
  | { status: "failed"; message: string };

/**
 * Pays for a list or its draft: the server prices and opens the order,
 * Razorpay Checkout takes the payment, and the server confirms it before
 * anything is marked paid.
 */
export async function checkout({
  listName,
  target,
  prefill,
  onFailedAttempt,
}: {
  listName: string;
  target: PaymentTarget;
  prefill: { name?: string; email?: string };
  /** A declined attempt; Checkout stays open so they can try again. */
  onFailedAttempt?: (message: string) => void;
}): Promise<CheckoutOutcome> {
  if (!window.Razorpay && !(await loadScript(CHECKOUT_SCRIPT))) {
    return { status: "failed", message: "Razorpay didn't load. Check your connection and try again." };
  }
  const Razorpay = window.Razorpay;
  if (!Razorpay) return { status: "failed", message: "Razorpay didn't load. Please try again." };

  const order = await createOrder(listName, target);
  if (!order.success) return { status: "failed", message: order.message };

  return new Promise((resolve) => {
    const widget = new Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
      amount: order.data.amount,
      currency: order.data.currency,
      order_id: order.data.id,
      name: "GiftQR",
      description: target === "list" ? `Unlock "${listName}"` : `Add new items to "${listName}"`,
      prefill,
      theme: { color: "#D6284A" },
      handler: async (payment: CheckoutPayment) => {
        const confirmed = await confirmPayment(listName, target, {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
        });
        resolve(
          confirmed.success
            ? { status: "paid", message: confirmed.message }
            : { status: "failed", message: confirmed.message || "We couldn't confirm that payment. Please contact support." }
        );
      },
      modal: { ondismiss: () => resolve({ status: "dismissed" }) },
    });
    widget.on("payment.failed", (response) => onFailedAttempt?.(`Payment failed: ${response.error.description}`));
    widget.open();
  });
}
