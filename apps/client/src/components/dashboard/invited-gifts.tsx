"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Gift } from "lucide-react";
import type { InvitedGift } from "@giftqr/shared";
import { getInvitedGifts } from "@/lib/api/lists";
import { scanPath } from "./qr-panel";
import styles from "./dashboard.module.css";

/** Gifts other people sent to this account, each opening its scan page. */
export function InvitedGifts({ isGuest }: { isGuest: boolean }) {
  const [gifts, setGifts] = useState<InvitedGift[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isGuest) return;
    void getInvitedGifts().then((response) => {
      if (response.success) setGifts(response.data);
      else setError(response.message || "We couldn't load the gifts sent to you.");
    });
  }, [isGuest]);

  return (
    <section aria-labelledby="invited-heading" className="mt-4 flex flex-col gap-3">
      <h2 id="invited-heading" className="m-0 font-display text-[22px] font-extrabold tracking-display">
        Gifts for you{" "}
        {gifts && (
          <span className="ml-1.5 inline-grid h-[30px] min-w-[30px] place-items-center rounded-full bg-ribbon px-2 text-sm text-white">
            {gifts.length}
          </span>
        )}
      </h2>

      {isGuest ? (
        <p className="m-0 rounded-[18px] bg-white px-[18px] py-4 text-[15px] text-plum-body">
          Sign in with Google to see the gifts people send to your email.
        </p>
      ) : error ? (
        <p role="alert" className="m-0 rounded-[18px] bg-peach px-[18px] py-4 font-semibold text-ribbon-dark">
          {error}
        </p>
      ) : !gifts ? (
        <p className="m-0 text-plum-body">Checking your mailbox…</p>
      ) : gifts.length === 0 ? (
        <p className="m-0 rounded-[18px] border-2 border-dashed border-line-dash bg-white px-[18px] py-4 text-[15px] text-plum-body">
          Nothing yet. When someone sends a gift to your email, it shows up here.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {gifts.map((gift) => (
            <li key={`${gift.ownerEmail}/${gift.listName}`}>
              <a
                className={styles.invitedCard}
                href={scanPath(gift.ownerEmail, gift.listName)}
                target="_blank"
                rel="noopener"
              >
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-gold text-plum" aria-hidden="true">
                  <Gift size={20} strokeWidth={2.5} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <b className="truncate font-display text-lg tracking-display">{gift.listName}</b>
                  <span className="truncate text-sm text-plum-mute">from {gift.ownerName.trim() || gift.ownerEmail}</span>
                </span>
                <ArrowUpRight size={20} strokeWidth={2.5} className="flex-none text-ribbon-deep" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
