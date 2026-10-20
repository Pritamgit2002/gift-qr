import type { IDraft } from "./draft.js";
import type { PaymentOrder } from "./payment.js";
import type { IUser } from "./user.js";

export type IImage = {
  imageName: string;
  url: string;
};

/** A voice note or song the maker uploaded. */
export type IAudio = {
  audioName: string;
  url: string;
  /** Length in seconds, when known. */
  duration?: number;
};

export type IList = {
  id: string;
  ownerEmail: IUser["email"];
  ownerName: IUser["name"];
  ownerType: IUser["type"];
  name: string;
  links: string[];
  messages: string[];
  images: IImage[];
  /** Not stored by the server yet; audio uploads are still to be built. */
  audios?: IAudio[];
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
