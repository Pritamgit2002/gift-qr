"use client";

import { useCallback, useEffect, useState } from "react";
import type { DraftDetails, IImage, ListSummary, SessionUser } from "@giftqr/shared";
import { formatUrl, isValidLink } from "@/constants";
import * as listsApi from "@/lib/api/lists";
import * as draftsApi from "@/lib/api/drafts";

export type ItemKind = "links" | "messages" | "images";

/** A list plus, for a paid list, the draft of items waiting to be paid for. */
export type GiftList = ListSummary & { draft: DraftDetails | null };

export type Item = {
  kind: ItemKind;
  /** Unique within the list. */
  key: string;
  text: string;
  image?: IImage;
  /** Sitting in the draft, not yet paid for. */
  draft: boolean;
};

// Guests get free lists, within these limits.
export const GUEST_LIMITS = { lists: 2, links: 2, messages: 2 } as const;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const emptyDraft = (): DraftDetails => ({ links: [], messages: [], images: [], status: "unpaid" });

/** Every item of a list, the draft's last and marked as such. */
export function itemsOf(list: GiftList, kind: ItemKind): Item[] {
  const toItems = (values: (string | IImage)[], draft: boolean) =>
    values.map((value): Item => {
      const image = typeof value === "string" ? undefined : value;
      const text = image ? image.imageName : (value as string);
      return { kind, key: `${draft ? "d" : "l"}:${image?.url ?? text}`, text, image, draft };
    });
  return [...toItems(list[kind], false), ...toItems(list.draft?.[kind] ?? [], true)];
}

/** "Holiday photos.jpg" → "Holiday Photos" */
const photoName = (file: File) =>
  (file.name.replace(/\.[^.]+$/, "") || "Photo")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type Result = { ok: true; message?: string } | { ok: false; message: string };
const fail = (message: string): Result => ({ ok: false, message });

export function useGiftLists(user: SessionUser) {
  const [lists, setLists] = useState<GiftList[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const isGuest = user.type === "guest";

  const reload = useCallback(async () => {
    const response = await listsApi.getLists();
    if (!response.success) {
      setLoadError(response.message || "We couldn't load your lists.");
      setLoading(false);
      return;
    }
    // Only a user's paid list has a draft; a missing one just means it's empty.
    const withDrafts = await Promise.all(
      response.data.map(async (list): Promise<GiftList> => {
        if (!list.paid || isGuest) return { ...list, draft: null };
        const draft = await draftsApi.getDraft(list.name);
        return { ...list, draft: draft.success ? draft.data : emptyDraft() };
      })
    );
    setLists(withDrafts);
    setLoadError(null);
    setLoading(false);
  }, [isGuest]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const update = (name: string, change: (list: GiftList) => GiftList) =>
    setLists((all) => all.map((list) => (list.name === name ? change(list) : list)));

  /** New items for a user's paid list go into its draft, to be paid for separately. */
  const goesToDraft = (list: GiftList) => list.paid && !isGuest;

  async function createList(rawName: string): Promise<Result> {
    const name = rawName.trim();
    if (!name) return fail("Give your list a name first.");
    if (lists.some((list) => list.name === name)) return fail("You already have a list with that name.");
    if (isGuest && lists.length >= GUEST_LIMITS.lists) {
      return fail(`Guests can have up to ${GUEST_LIMITS.lists} lists. Sign in with Google for more.`);
    }
    const response = await listsApi.saveList({ name });
    if (!response.success) return fail(response.message);
    const now = Date.now();
    setLists((all) => [
      ...all,
      { name, links: [], messages: [], images: [], paid: isGuest, updatedAt: now, draft: null },
    ]);
    return { ok: true, message: "List created" };
  }

  async function deleteList(name: string): Promise<Result> {
    const response = await listsApi.deleteList(name);
    if (!response.success) return fail(response.message);
    setLists((all) => all.filter((list) => list.name !== name));
    return { ok: true, message: `"${name}" deleted` };
  }

  async function addText(list: GiftList, kind: "links" | "messages", raw: string): Promise<Result> {
    const trimmed = raw.trim();
    if (!trimmed) return fail(kind === "links" ? "Paste a link first." : "Write a message first.");
    if (kind === "links" && !isValidLink(trimmed)) return fail("That doesn't look like a link.");
    const value = kind === "links" ? formatUrl(trimmed) : trimmed;

    if (itemsOf(list, kind).some((item) => item.text === value)) {
      return fail(kind === "links" ? "That link is already in this list." : "That message is already in this list.");
    }
    if (isGuest && list[kind].length >= GUEST_LIMITS[kind]) {
      return fail(`Guest lists can hold up to ${GUEST_LIMITS[kind]} ${kind}.`);
    }

    if (goesToDraft(list)) {
      // The draft endpoint replaces both arrays, so send everything.
      const draft = list.draft ?? emptyDraft();
      const next = { links: draft.links, messages: draft.messages, [kind]: [...draft[kind], value] };
      const response = await draftsApi.saveDraftItems(list.name, next);
      if (!response.success) return fail(response.message);
      update(list.name, (l) => ({ ...l, draft: { ...(l.draft ?? emptyDraft()), ...next, status: "unpaid" } }));
      return { ok: true, message: "Added to the draft" };
    }

    const response = await listsApi.saveList({ name: list.name, [kind]: [value] });
    if (!response.success) return fail(response.message);
    update(list.name, (l) => ({ ...l, [kind]: [...l[kind], value], updatedAt: Date.now() }));
    return { ok: true, message: kind === "links" ? "Link added" : "Message added" };
  }

  async function addPhoto(list: GiftList, file: File): Promise<Result> {
    if (isGuest) return fail("Sign in with Google to add photos.");
    if (!file.type.startsWith("image/")) return fail("That file isn't an image.");
    if (file.size > MAX_PHOTO_BYTES) return fail("Photos can be up to 5 MB.");
    const imageName = photoName(file);
    if (itemsOf(list, "images").some((item) => item.text === imageName)) {
      return fail(`There's already a photo called "${imageName}". Rename the file and try again.`);
    }

    if (goesToDraft(list)) {
      const response = await draftsApi.uploadDraftImage(list.name, file, imageName);
      if (!response.success) return fail(response.message);
      update(list.name, (l) => {
        const draft = l.draft ?? emptyDraft();
        return { ...l, draft: { ...draft, images: [...draft.images, response.data], status: "unpaid" } };
      });
      return { ok: true, message: "Photo added to the draft" };
    }

    const response = await listsApi.uploadListImage(list.name, file, imageName);
    if (!response.success) return fail(response.message);
    update(list.name, (l) => ({ ...l, images: [...l.images, response.data], updatedAt: Date.now() }));
    return { ok: true, message: "Photo added" };
  }

  async function removeItem(list: GiftList, item: Item): Promise<Result> {
    let response;
    if (item.draft) {
      response =
        item.kind === "links"
          ? await draftsApi.deleteDraftLink(list.name, item.text)
          : item.kind === "messages"
            ? await draftsApi.deleteDraftMessage(list.name, item.text)
            : await draftsApi.deleteDraftImage(list.name, item.image!.url);
    } else {
      response =
        item.kind === "links"
          ? await listsApi.deleteLinkFromList(list.name, item.text)
          : item.kind === "messages"
            ? await listsApi.deleteMessageFromList(list.name, item.text)
            : await listsApi.deleteListImage(list.name, item.image!);
    }
    if (!response.success) return fail(response.message);

    const keep = (values: (string | IImage)[]) =>
      values.filter((value) => (typeof value === "string" ? value !== item.text : value.url !== item.image?.url));
    update(list.name, (l) => {
      if (!item.draft) return { ...l, [item.kind]: keep(l[item.kind]) };
      const draft = l.draft ?? emptyDraft();
      return { ...l, draft: { ...draft, [item.kind]: keep(draft[item.kind]) } };
    });
    return { ok: true, message: "Removed" };
  }

  return { lists, loading, loadError, isGuest, reload, createList, deleteList, addText, addPhoto, removeItem };
}
