import type { DraftDetails, IImage } from "@giftqr/shared";
import { request, seg } from "./client";

// A draft collects items added to an already-paid list until they are paid for.
const draftPath = (listName: string) => `/lists/${seg(listName)}/draft`;

export const getDraft = (listName: string) => request<DraftDetails>(draftPath(listName));

/** Replaces the draft's links and messages. */
export const saveDraftItems = (listName: string, items: { links: string[]; messages: string[] }) =>
  request(draftPath(listName), { method: "PUT", json: items });

export const uploadDraftImage = (listName: string, image: File, imageName: string) => {
  const body = new FormData();
  body.append("image", image);
  body.append("imageName", imageName);
  return request<IImage>(`${draftPath(listName)}/images`, { method: "POST", body });
};

export const deleteDraftImage = (listName: string, imageUrl: string) =>
  request(`${draftPath(listName)}/images`, { method: "DELETE", json: { imageUrl } });

export const deleteDraftLink = (listName: string, link: string) =>
  request(`${draftPath(listName)}/links`, { method: "DELETE", json: { link } });

export const deleteDraftMessage = (listName: string, message: string) =>
  request(`${draftPath(listName)}/messages`, { method: "DELETE", json: { message } });
