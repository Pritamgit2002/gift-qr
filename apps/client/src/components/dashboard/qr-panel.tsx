"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { Download, Loader2, Lock, LockOpen } from "lucide-react";
import type { PaymentTarget } from "@giftqr/shared";
import { buttonVariants } from "@/components/brand/button";
import { QrArt } from "@/components/brand/art";
import { cn } from "@/lib/utils";
import type { GiftList } from "./use-gift-lists";
import type { Summary } from "./summary";
import { AccessPanel } from "./access-panel";
import styles from "./dashboard.module.css";

const qrColors = { dark: "#23142E", light: "#FFFFFF" };

/** The page a scan opens. */
export const scanPath = (ownerEmail: string, listName: string) =>
  `/${encodeURIComponent(ownerEmail)}/${encodeURIComponent(listName)}`;

export function QrPanel({
  list,
  summary,
  ownerEmail,
  isGuest,
  paying,
  onPay,
  onSetAccess,
}: {
  list: GiftList;
  summary: Summary;
  ownerEmail: string;
  isGuest: boolean;
  paying: PaymentTarget | null;
  onPay: (target: PaymentTarget) => void;
  /** Saves who may open the QR; resolves true when it worked. */
  onSetAccess: (emails: string[]) => Promise<boolean>;
}) {
  // Chosen before unlocking, and still changeable after: a scan checks it every time.
  return (
    <div className="flex flex-col gap-5 border-t-2 border-dashed border-line pt-[22px]">
      <AccessPanel emails={list.allowedEmails} ownerEmail={ownerEmail} onSave={onSetAccess} />
      {list.paid ? (
        <LiveCode list={list} summary={summary} ownerEmail={ownerEmail} isGuest={isGuest} paying={paying} onPay={onPay} />
      ) : (
        <LockedCode summary={summary} invited={list.allowedEmails.length} paying={paying} onPay={onPay} />
      )}
    </div>
  );
}

function LiveCode({
  list,
  summary,
  ownerEmail,
  isGuest,
  paying,
  onPay,
}: {
  list: GiftList;
  summary: Summary;
  ownerEmail: string;
  isGuest: boolean;
  paying: PaymentTarget | null;
  onPay: (target: PaymentTarget) => void;
}) {
  const path = scanPath(ownerEmail, list.name);
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    const full = `${window.location.origin}${path}`;
    setUrl(full);
    QRCode.toDataURL(full, { margin: 1, width: 600, color: qrColors }).then(setImage, () => setImage(""));
  }, [path]);

  const download = async () => {
    try {
      const png = await QRCode.toDataURL(url, { margin: 2, width: 1200, color: qrColors });
      const link = document.createElement("a");
      link.href = png;
      link.download = `${list.name} GiftQR.png`;
      link.click();
    } catch {
      toast.error("We couldn't make the image. Please try again.");
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copying didn't work. You can copy the link from the address shown.");
    }
  };

  const draft = summary.draftPrice;
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="flex-none animate-stamp rounded-[22px] border-2 border-plum bg-white p-3.5 shadow-hard-gold">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- a generated data URL
          <img src={image} alt={`QR code for ${list.name}`} width={150} height={150} className="block h-[150px] w-[150px]" />
        ) : (
          <span className="block h-[150px] w-[150px]" />
        )}
      </div>
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3">
        <span className="font-display text-2xl font-extrabold tracking-display">Your QR code is live</span>
        <span className="break-all text-sm text-plum-body">Points to {path}</span>
        {!isGuest && draft && summary.draftCount > 0 && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-gold-soft px-3.5 py-3">
            <span className="flex-[1_1_200px] text-[15px]">
              <b>
                {summary.draftCount} new {summary.draftCount === 1 ? "item is" : "items are"}
              </b>{" "}
              waiting in a draft.
            </span>
            <button
              type="button"
              className={buttonVariants({ variant: "gold", size: "sm" })}
              disabled={paying !== null}
              onClick={() => onPay("draft")}
            >
              {paying === "draft" ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Opening checkout…
                </>
              ) : (
                <>Add them · ₹{draft.amount}</>
              )}
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className={buttonVariants({ variant: "dark", size: "sm" })} onClick={download} disabled={!url}>
            <Download size={16} strokeWidth={2.5} aria-hidden="true" />
            Download
          </button>
          <button type="button" className={buttonVariants({ variant: "ghost", size: "sm" })} onClick={copy} disabled={!url}>
            Copy link
          </button>
          <a className={buttonVariants({ variant: "ghost", size: "sm" })} href={path} target="_blank" rel="noopener">
            Preview a scan
          </a>
        </div>
      </div>
    </div>
  );
}

function LockedCode({
  summary,
  invited,
  paying,
  onPay,
}: {
  summary: Summary;
  /** How many people the list is limited to; 0 means anyone. */
  invited: number;
  paying: PaymentTarget | null;
  onPay: (target: PaymentTarget) => void;
}) {
  const count = summary.links + summary.messages + summary.photos + summary.videos + summary.audios;
  const audience = invited ? `for ${invited} ${invited === 1 ? "person" : "people"}` : "for everyone";
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative flex-none overflow-hidden rounded-[22px] border-2 border-dashed border-line-dash bg-paper p-3.5">
        <QrArt size={150} className="opacity-50 blur-[5px]" />
        <span className="absolute left-1/2 top-1/2 ml-[-30px] mt-[-30px] grid h-[60px] w-[60px] animate-wobble place-items-center rounded-full bg-plum text-gold">
          <Lock size={26} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </div>
      <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-3">
        <span className="font-display text-2xl font-extrabold tracking-display">
          {summary.missing ? "Your QR code is still wrapped" : "Ready to unlock"}
        </span>
        <span className="text-[15px] text-plum-body">
          {count} {count === 1 ? "item" : "items"} packed · total ₹{summary.price.amount}
        </span>
        <span className={styles.barTrack} role="progressbar" aria-valuenow={summary.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress toward unlocking">
          <span className={styles.barFill} style={{ width: `${summary.progress}%` }} />
        </span>
        {summary.missing ? (
          <span className={cn(buttonVariants({ variant: "off" }), "self-start")}>
            Add {summary.missing} more to unlock
          </span>
        ) : (
          <button
            type="button"
            className={cn(buttonVariants(), "self-start")}
            disabled={paying !== null}
            onClick={() => onPay("list")}
          >
            {paying === "list" ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                Opening checkout…
              </>
            ) : (
              <>
                <LockOpen size={18} strokeWidth={2.5} aria-hidden="true" />
                Unlock {audience} · ₹{summary.price.amount}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
