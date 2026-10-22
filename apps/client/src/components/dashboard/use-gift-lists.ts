"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isMediaKind,
  MEDIA_RULES,
  type DraftDetails,
  type ListSummary,
  type MediaItem,
  type MediaKind,
  type SessionUser,
} from "@giftqr/shared";
import { formatUrl, isValidLink } from "@/constants";
import * as listsApi from "@/lib/api/lists";
import * as draftsApi from "@/lib/api/drafts";
import { GUEST_LIMITS } from "@/lib/pricing";
import { peaksOf } from "@/lib/waveform";

export type ItemKind = "links" | "messages" | MediaKind;

/** A list plus, for a paid list, the draft of items waiting to be paid for. */
export type GiftList = ListSummary & { draft: DraftDetails | null };

export type Item = {
  kind: ItemKind;
  /** Unique within the list. */
  key: string;
  text: string;
  /** Set for photos, videos and audio clips. */
  media?: MediaItem;
  /** Sitting in the draft, not yet paid for. */
  draft: boolean;
};

const MB = 1024 * 1024;

const emptyDraft = (): DraftDetails => ({
  links: [],
  messages: [],
  images: [],
  videos: [],
  audios: [],
  status: "unpaid",
});

/** Every item of a list, the draft's last and marked as such. */
export function itemsOf(list: GiftList, kind: ItemKind): Item[] {
  const toItems = (values: (string | MediaItem)[], draft: boolean) =>
    values.map((value): Item => {
      const media = typeof value === "string" ? undefined : value;
      const text = media ? media.name : (value as string);
      return { kind, key: `${draft ? "d" : "l"}:${media?.key ?? text}`, text, media, draft };
    });
  return [...toItems(list[kind], false), ...toItems(list.draft?.[kind] ?? [], true)];
}

/** "Holiday photos.jpg" → "Holiday Photos" */
const mediaName = (file: File, fallback: string) =>
  (file.name.replace(/\.[^.]+$/, "") || fallback)
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
      {
        name,
        links: [],
        messages: [],
        images: [],
        videos: [],
        audios: [],
        allowedEmails: [],
        paid: isGuest,
        updatedAt: now,
        draft: null,
      },
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

  async function addMedia(list: GiftList, kind: MediaKind, file: File): Promise<Result> {
    const rule = MEDIA_RULES[kind];
    if (isGuest) return fail("Sign in with Google to add photos, videos and audio.");
    if (!file.type.startsWith(rule.mimePrefix)) return fail(`"${file.name}" isn't a ${rule.noun}.`);
    if (file.size > rule.maxBytes) return fail(`A ${rule.noun} can be up to ${rule.maxBytes / MB} MB.`);
    const name = mediaName(file, rule.noun.charAt(0).toUpperCase() + rule.noun.slice(1));
    if (itemsOf(list, kind).some((item) => item.text === name)) {
      return fail(`There's already a ${rule.noun} called "${name}". Rename the file and try again.`);
    }
    const peaks = kind === "audios" ? await peaksOf(file) : undefined;
    const added = `${rule.noun.charAt(0).toUpperCase()}${rule.noun.slice(1)} added`;

    if (goesToDraft(list)) {
      const response = await draftsApi.uploadDraftMedia(list.name, kind, file, name, peaks);
      if (!response.success) return fail(response.message);
      update(list.name, (l) => {
        const draft = l.draft ?? emptyDraft();
        return { ...l, draft: { ...draft, [kind]: [...draft[kind], response.data], status: "unpaid" } };
      });
      return { ok: true, message: `${added} to the draft` };
    }

    const response = await listsApi.uploadListMedia(list.name, kind, file, name, peaks);
    if (!response.success) return fail(response.message);
    update(list.name, (l) => ({ ...l, [kind]: [...l[kind], response.data], updatedAt: Date.now() }));
    return { ok: true, message: added };
  }

  /** Who may open the QR besides the owner; none means anyone who scans it. */
  async function setAccess(list: GiftList, emails: string[]): Promise<Result> {
    const response = await listsApi.setListAccess(list.name, emails);
    if (!response.success) return fail(response.message);
    update(list.name, (l) => ({ ...l, allowedEmails: response.data }));
    return { ok: true, message: response.message };
  }

  async function removeItem(list: GiftList, item: Item): Promise<Result> {
    const { kind } = item;
    let response;
    if (isMediaKind(kind)) {
      const key = item.media!.key;
      response = item.draft
        ? await draftsApi.deleteDraftMedia(list.name, kind, key)
        : await listsApi.deleteListMedia(list.name, kind, key);
    } else if (item.draft) {
      response =
        kind === "links"
          ? await draftsApi.deleteDraftLink(list.name, item.text)
          : await draftsApi.deleteDraftMessage(list.name, item.text);
    } else {
      response =
        kind === "links"
          ? await listsApi.deleteLinkFromList(list.name, item.text)
          : await listsApi.deleteMessageFromList(list.name, item.text);
    }
    if (!response.success) return fail(response.message);

    const keep = (values: (string | MediaItem)[]) =>
      values.filter((value) => (typeof value === "string" ? value !== item.text : value.key !== item.media?.key));
    update(list.name, (l) => {
      if (!item.draft) return { ...l, [kind]: keep(l[kind]) };
      const draft = l.draft ?? emptyDraft();
      return { ...l, draft: { ...draft, [kind]: keep(draft[kind]) } };
    });
    return { ok: true, message: "Removed" };
  }

  return { lists, loading, loadError, isGuest, reload, createList, deleteList, addText, addMedia, setAccess, removeItem };
}
