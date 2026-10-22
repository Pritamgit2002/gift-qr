import type { IDraft } from "./draft.js";
import type { PaymentOrder } from "./payment.js";
import type { IUser } from "./user.js";

/** The kinds of uploaded file a list can hold, named as the list's fields. */
export const MEDIA_KINDS = ["images", "videos", "audios"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const isMediaKind = (value: unknown): value is MediaKind =>
  typeof value === "string" && (MEDIA_KINDS as readonly string[]).includes(value);

const MB = 1024 * 1024;

/** What each kind accepts: the MIME type prefix and the largest file. Checked on both sides. */
export const MEDIA_RULES: Record<MediaKind, { mimePrefix: string; maxBytes: number; noun: string }> = {
  images: { mimePrefix: "image/", maxBytes: 5 * MB, noun: "photo" },
  videos: { mimePrefix: "video/", maxBytes: 100 * MB, noun: "video" },
  audios: { mimePrefix: "audio/", maxBytes: 20 * MB, noun: "audio clip" },
};

/** An uploaded file as stored: its display name and its S3 object key. */
export type IMedia = {
  name: string;
  key: string;
  /** Audio only: loudness bars for the waveform, each 0–1, worked out from the file when it was uploaded. */
  peaks?: number[];
};

/** How many bars an audio waveform has. */
export const WAVEFORM_BARS = 64;

/** Reads waveform peaks sent with an upload: WAVEFORM_BARS numbers in 0–1, or nothing. */
export function parsePeaks(value: unknown): number[] | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const peaks: unknown = JSON.parse(value);
    if (
      Array.isArray(peaks) &&
      peaks.length === WAVEFORM_BARS &&
      peaks.every((peak) => typeof peak === "number" && peak >= 0 && peak <= 1)
    ) {
      return peaks.map((peak: number) => Math.round(peak * 1000) / 1000);
    }
  } catch {
    // Not JSON: no waveform, the player draws a flat one.
  }
  return undefined;
}

/** An uploaded file as the API returns it, with a short-lived signed link to it. */
export type MediaItem = IMedia & { url: string };

export type IList = {
  id: string;
  ownerEmail: IUser["email"];
  ownerName: IUser["name"];
  ownerType: IUser["type"];
  name: string;
  links: string[];
  messages: string[];
  images: IMedia[];
  videos: IMedia[];
  audios: IMedia[];
  /** Lowercased emails that may open the QR, besides the owner. Empty means anyone can. */
  allowedEmails: string[];
  paid: boolean;
  /** Set once paid: rupees paid and the Razorpay ids. */
  price?: number;
  paymentId?: string;
  orderId?: string;
  /** The checkout started for this list and not confirmed yet. */
  pendingOrder?: PaymentOrder;
  draft?: IDraft;
  createdAt: number;
  updatedAt: number;
};
