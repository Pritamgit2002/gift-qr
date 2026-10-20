import type { IDraft } from "./draft.js";
import type { IAudio, IImage, IList } from "./list.js";

/** Envelope every API response uses. */
export type ApiResult<T> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

export type ListDetails = Pick<IList, "name" | "links" | "messages" | "images" | "audios" | "paid">;

export type ListSummary = ListDetails & Pick<IList, "updatedAt">;

export type DraftDetails = Pick<IDraft, "links" | "messages" | "images" | "audios" | "status">;

export type UploadedImage = IImage;

export type UploadedAudio = IAudio;
