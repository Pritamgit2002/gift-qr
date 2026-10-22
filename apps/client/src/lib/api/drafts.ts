import type { DraftDetails, MediaItem, MediaKind } from "@giftqr/shared";
import { request, seg } from "./client";
import { mediaForm } from "./lists";

// A draft collects items added to an already-paid list until they are paid for.
const draftPath = (listName: string) => `/lists/${seg(listName)}/draft`;

export const getDraft = (listName: string) => request<DraftDetails>(draftPath(listName));

/** Replaces the draft's links and messages. */
export const saveDraftItems = (listName: string, items: { links: string[]; messages: string[] }) =>
  request(draftPath(listName), { method: "PUT", json: items });

export const uploadDraftMedia = (listName: string, kind: MediaKind, file: File, name: string, peaks?: number[]) =>
  request<MediaItem>(`${draftPath(listName)}/media/${kind}`, { method: "POST", body: mediaForm(file, name, peaks) });

export const deleteDraftMedia = (listName: string, kind: MediaKind, key: string) =>
  request(`${draftPath(listName)}/media/${kind}`, { method: "DELETE", json: { key } });

export const deleteDraftLink = (listName: string, link: string) =>
  request(`${draftPath(listName)}/links`, { method: "DELETE", json: { link } });

export const deleteDraftMessage = (listName: string, message: string) =>
  request(`${draftPath(listName)}/messages`, { method: "DELETE", json: { message } });
