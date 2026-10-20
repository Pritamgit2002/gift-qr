import { Plus } from "lucide-react";
import { ITEM_PRICES, MIN_LIST_ITEMS } from "@giftqr/shared";
import styles from "./landing.module.css";

const questions = [
  {
    q: "What happens when someone scans my code?",
    a: "GiftQR picks one item from your list at random. A link opens, a message appears on screen, a photo is shown, or a voice note plays, as many times as they like. Scan again and it may be something else.",
  },
  {
    q: "Can I add more after I've paid?",
    a: "Yes. New items go into a draft. Once you pay for the draft, they're added to the same list, so the QR code you already shared keeps working.",
  },
  {
    q: "Do I need an account?",
    a: "Sign in with Google, or try it as a guest. Guests can make up to two free lists, with two links and two messages each.",
  },
  {
    q: "What's the minimum?",
    a: `${MIN_LIST_ITEMS} items per list. Links and messages are ₹${ITEM_PRICES.link} each, photos and audio clips are ₹${ITEM_PRICES.image}.`,
  },
];

const reveals = ["scroll-rise", "scroll-rise-2", "scroll-rise-3", "scroll-rise-3"];

export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="py-[90px]">
      <div className="mx-auto w-full max-w-[860px] px-4 sm:px-8">
        <h2
          id="faq-heading"
          className="scroll-rise mb-9 mt-0 text-center font-display text-[clamp(36px,4.5vw,56px)] font-extrabold leading-none tracking-display"
        >
          Questions, unwrapped
        </h2>
        <div className="flex flex-col gap-3.5">
          {questions.map((item, i) => (
            // The reveal wraps the card so it doesn't hold the card's hover transform.
            <div key={item.q} className={reveals[i]}>
              <details className={styles.faq}>
                <summary>
                  {item.q}
                  <Plus size={24} strokeWidth={3} className={`${styles.plus} text-ribbon`} aria-hidden="true" />
                </summary>
                <div className={`${styles.faqBody} px-6 pb-[22px] text-[17px] leading-[1.65] text-plum-body`}>{item.a}</div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
