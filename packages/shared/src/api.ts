import type { IDraft } from "./draft.js";
import type { IImage, IList } from "./list.js";

/** Envelope every API response uses. */
export type ApiResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

export type ListDetails = Pick<IList, "name" | "links" | "messages" | "images" | "paid">;

export type ListSummary = ListDetails & Pick<IList, "updatedAt">;

export type DraftDetails = Pick<IDraft, "links" | "messages" | "images" | "status">;

export type UploadedImage = IImage;
