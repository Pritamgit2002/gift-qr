import type { IAudio, IImage } from "./list.js";
import type { PaymentOrder } from "./payment.js";

export type DraftStatus = "paid" | "unpaid";

export type IDraft = {
  id: string;
  ownerEmail: string;
  listName: string;
  ownerName: string;
  ownerType: "user";
  draftName: string;
  status: DraftStatus;
  links: string[];
  messages: string[];
  images: IImage[];
  /** Not stored by the server yet; audio uploads are still to be built. */
  audios?: IAudio[];
  /** The checkout started for these items and not confirmed yet. */
  pendingOrder?: PaymentOrder;
  createdAt: number;
  updatedAt: number;
};

/** Every list has at most one draft, named after the list. */
export const draftNameFor = (listName: string) => `draft_${listName}`;
