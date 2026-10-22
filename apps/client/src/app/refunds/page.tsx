import type { Metadata } from "next";
import Link from "next/link";
import { MIN_LIST_ITEMS } from "@giftqr/shared";
import { ContactDetails, EmailLink, LegalPage, type LegalSection } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy | GiftQR",
  description:
    "How GiftQR payments, digital delivery, cancellations and refunds work, and how long a refund takes to reach you.",
};

const sections: LegalSection[] = [
  {
    id: "what-you-pay-for",
    title: "What you pay for",
    body: (
      <>
        <p>
          A GiftQR payment unlocks a digital service: the QR code for one list, or new items added to a list you already
          paid for. Each is a one-time payment in Indian rupees, priced per item. There are no subscriptions and nothing
          renews or charges you again.
        </p>
        <p>
          A list needs at least {MIN_LIST_ITEMS} items before you can pay for it, and checkout always shows the exact
          amount before you pay. Prices are listed in our <Link href="/#pricing">pricing</Link>. Guest lists are free.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery",
    body: (
      <>
        <p>
          Everything GiftQR sells is delivered online, straight away. Once Razorpay confirms your payment and we check it,
          your list unlocks and its QR code appears in your dashboard, usually within seconds. Nothing is shipped, so
          there are no shipping charges or delivery addresses.
        </p>
        <p>
          If your payment went through but your list hasn&apos;t unlocked within 30 minutes, email us with the details
          below and we&apos;ll sort it out.
        </p>
      </>
    ),
  },
  {
    id: "cancelling",
    title: "Cancelling",
    body: (
      <ul>
        <li>
          <strong>Before paying:</strong> close the checkout window at any time. Nothing is charged.
        </li>
        <li>
          <strong>After paying:</strong> the gift is unlocked the moment payment succeeds, so the service has been
          delivered and can&apos;t be cancelled. You can still delete the list at any time, but that doesn&apos;t
          refund it.
        </li>
        <li>We never charge cancellation fees.</li>
      </ul>
    ),
  },
  {
    id: "when-we-refund",
    title: "When we refund",
    body: (
      <>
        <p>We refund the full amount when:</p>
        <ul>
          <li>you were charged, but your list or new items didn&apos;t unlock and we can&apos;t fix it within 2 days;</li>
          <li>you were charged twice, or more than checkout showed, for the same thing;</li>
          <li>
            a technical fault on our side stops a paid gift from opening and we can&apos;t fix it within 7 days of your
            report; or
          </li>
          <li>we remove a feature you paid for without offering an alternative.</li>
        </ul>
        <p>
          If money left your account but the payment failed, you don&apos;t need to ask: Razorpay or your bank returns it
          automatically, usually within 5 to 7 working days.
        </p>
      </>
    ),
  },
  {
    id: "when-we-dont",
    title: "When we don't refund",
    body: (
      <ul>
        <li>You changed your mind after the gift unlocked.</li>
        <li>
          You made a mistake in the content. You can add items to a paid list through its draft, and limit or change who
          can open it for free.
        </li>
        <li>A website your gift links to changed or went offline.</li>
        <li>
          The gift was removed because it broke our <Link href="/terms">Terms of Service</Link>.
        </li>
      </ul>
    ),
  },
  {
    id: "how-to-ask",
    title: "How to ask for a refund",
    body: (
      <>
        <p>
          Email <EmailLink subject="Refund request" /> within 30 days of paying, with:
        </p>
        <ul>
          <li>the email address you sign in with;</li>
          <li>the list&apos;s name;</li>
          <li>the Razorpay payment ID, which starts with &quot;pay_&quot; and is in Razorpay&apos;s receipt; and</li>
          <li>what went wrong.</li>
        </ul>
        <p>We reply within 48 hours and decide within 7 days.</p>
      </>
    ),
  },
  {
    id: "timing",
    title: "When the money arrives",
    body: (
      <p>
        Approved refunds go back to the card, UPI account, bank account or wallet you paid with, through Razorpay. We
        start the refund within 2 working days of approving it. Banks usually take another 5 to 7 working days to show it,
        and UPI is often quicker. We can&apos;t refund to a different account or in cash.
      </p>
    ),
  },
  {
    id: "consumer-rights",
    title: "Your consumer rights",
    body: (
      <p>
        This policy doesn&apos;t take away any of your rights under the Consumer Protection Act, 2019 or the Consumer
        Protection (E-Commerce) Rules, 2020. If we can&apos;t resolve a complaint, the{" "}
        <Link href="/contact#other-options">Contact</Link> page lists where else you can go.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <>
        <p>Payment questions and refund requests go to:</p>
        <ContactDetails />
      </>
    ),
  },
];

export default function RefundsPage() {
  return (
    <LegalPage
      href="/refunds"
      title="Refund Policy"
      intro="How payments, delivery, cancellations and refunds work on GiftQR."
      summary={[
        "Every payment is one-time, in rupees, through Razorpay. No subscriptions.",
        "Your gift unlocks online the moment payment succeeds. Nothing is shipped.",
        "Cancel any time before you pay. After that, the gift has been delivered.",
        "If something goes wrong on our side, such as a double charge or a list that didn't unlock, we refund in full.",
        "Refunds go back to how you paid, usually within 5 to 7 working days.",
      ]}
      sections={sections}
    />
  );
}
