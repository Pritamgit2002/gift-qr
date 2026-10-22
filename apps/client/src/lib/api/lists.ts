import type { InvitedGift, ListDetails, ListSummary, MediaItem, MediaKind } from "@giftqr/shared";
import { request, seg } from "./client";

/**
 * Public: what a scanned QR code shows. On the server, pass the viewer's cookies
 * along, so a gift sent to particular people can tell who is looking.
 */
export const getListByName = (ownerEmail: string, listName: string, cookie?: string) =>
  request<ListDetails>(`/public/lists/${seg(ownerEmail)}/${seg(listName)}`, {
    ...(cookie && { headers: { cookie } }),
  });

// The rest act on the signed-in user's lists.

export const getLists = () => request<ListSummary[]>("/lists");

/** Paid lists other people sent to the signed-in user. */
export const getInvitedGifts = () => request<InvitedGift[]>("/lists/invited");

/** Creates the list, or adds the links/messages to it when it already exists. */
export const saveList = (list: { name: string; links?: string[]; messages?: string[] }) =>
  request("/lists", { method: "POST", json: list });

export const deleteList = (listName: string) =>
  request(`/lists/${seg(listName)}`, { method: "DELETE" });

export const deleteLinkFromList = (listName: string, link: string) =>
  request(`/lists/${seg(listName)}/links`, { method: "DELETE", json: { link } });

export const deleteMessageFromList = (listName: string, message: string) =>
  request(`/lists/${seg(listName)}/messages`, { method: "DELETE", json: { message } });

/** Who may open the list's QR besides its owner; none means anyone. Returns the cleaned-up list. */
export const setListAccess = (listName: string, emails: string[]) =>
  request<string[]>(`/lists/${seg(listName)}/access`, { method: "PUT", json: { emails } });

/** The form an upload sends; `peaks` is the waveform of an audio clip. */
export function mediaForm(file: File, name: string, peaks?: number[]) {
  const body = new FormData();
  body.append("name", name);
  if (peaks) body.append("peaks", JSON.stringify(peaks));
  body.append("file", file);
  return body;
}

export const uploadListMedia = (listName: string, kind: MediaKind, file: File, name: string, peaks?: number[]) =>
  request<MediaItem>(`/lists/${seg(listName)}/media/${kind}`, { method: "POST", body: mediaForm(file, name, peaks) });

export const deleteListMedia = (listName: string, kind: MediaKind, key: string) =>
  request(`/lists/${seg(listName)}/media/${kind}`, { method: "DELETE", json: { key } });
