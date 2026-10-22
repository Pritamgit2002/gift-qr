import type { IDraft } from "./draft.js";
import type { IList, MediaItem } from "./list.js";

/** Why the API turned a request down, for the cases a page handles differently. */
export type ErrorCode = "sign-in-required" | "not-invited";

/** Envelope every API response uses. */
export type ApiResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string; code?: ErrorCode };

/** The media fields of a list or draft, with signed links. */
type WithMedia = { images: MediaItem[]; videos: MediaItem[]; audios: MediaItem[] };

export type ListDetails = Pick<IList, "name" | "links" | "messages" | "paid"> & WithMedia;

export type ListSummary = ListDetails & Pick<IList, "updatedAt" | "allowedEmails">;

export type DraftDetails = Pick<IDraft, "links" | "messages" | "status"> & WithMedia;

/** A paid list someone else invited the signed-in user to. */
export type InvitedGift = {
  listName: string;
  ownerName: string;
  ownerEmail: string;
  updatedAt: number;
};
