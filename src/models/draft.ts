import { IImage } from "./list";

export type IDraft = {
  id: string;
  ownerEmail: string;
  listName: string;
  ownerName: string;
  ownerType: "user";
  draftName: string;
  status: "paid" | "unpaid";
  links: string[];
  messages: string[];
  images: IImage[];
  createdAt: number;
  updatedAt: number;
};

export const listCollectionName = "draft";
