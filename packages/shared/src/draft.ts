import type { IImage } from "./list.js";

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
  createdAt: number;
  updatedAt: number;
};

/** Every list has at most one draft, named after the list. */
export const draftNameFor = (listName: string) => `draft_${listName}`;
