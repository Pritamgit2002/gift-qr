import type { IDraft } from "./draft.js";
import type { IUser } from "./user.js";

export type IImage = {
  imageName: string;
  url: string;
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
  paid: boolean;
  price?: number;
  paymentId?: string;
  orderId?: string;
  draft?: IDraft;
  createdAt: number;
  updatedAt: number;
};
