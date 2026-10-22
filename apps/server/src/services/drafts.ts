import { nanoid } from "nanoid";
import {
  draftNameFor,
  MEDIA_KINDS,
  priceOf,
  type CheckoutPayment,
  type DraftDetails,
  type IMedia,
  type MediaItem,
  type MediaKind,
  type PaymentOrder,
  type SessionUser,
} from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { drafts, lists } from "../lib/mongodb.js";
import { deleteFromS3, uploadToS3, withUrls, type UploadedFile } from "../lib/s3.js";
import { GUESTS_CANT_UPLOAD } from "./lists.js";
import { createOrder, verifyPayment } from "./payments.js";

// A draft holds items added to an already-paid list until they are paid for and merged in.
const draftOf = (ownerEmail: string, listName: string) => ({
  ownerEmail,
  listName,
  draftName: draftNameFor(listName),
});

/** Every media field, empty, for a new draft; less `except`, which the same update sets. */
const emptyMedia = (except?: MediaKind) =>
  Object.fromEntries(MEDIA_KINDS.filter((kind) => kind !== except).map((kind) => [kind, []]));

export async function getDraft(ownerEmail: string, listName: string): Promise<DraftDetails> {
  const draft = await drafts.findOne(draftOf(ownerEmail, listName));
  if (!draft) throw new HttpError(404, "Draft not found");
  return {
    links: draft.links ?? [],
    messages: draft.messages ?? [],
    images: await withUrls(draft.images),
    videos: await withUrls(draft.videos),
    audios: await withUrls(draft.audios),
    status: draft.status,
  };
}

/** Replaces the draft's links and messages, creating the draft if needed. */
export async function saveDraftItems(
  owner: SessionUser,
  listName: string,
  links: string[],
  messages: string[]
) {
  if (!links.length && !messages.length) {
    throw new HttpError(400, "You must add at least one link, message or image");
  }
  const now = Date.now();
  await drafts.updateOne(
    draftOf(owner.email, listName),
    {
      $set: { status: "unpaid", links, messages, updatedAt: now },
      $setOnInsert: { id: nanoid(), ownerName: owner.name, ownerType: "user", ...emptyMedia(), createdAt: now },
    },
    { upsert: true }
  );
}

export async function addDraftMedia(
  owner: SessionUser,
  listName: string,
  kind: MediaKind,
  file: UploadedFile,
  mediaName: string,
  peaks?: number[]
): Promise<MediaItem> {
  if (owner.type === "guest") throw new HttpError(403, GUESTS_CANT_UPLOAD);
  const media: IMedia = {
    name: mediaName,
    key: await uploadToS3(file, owner.email, kind),
    ...(kind === "audios" && peaks && { peaks }),
  };
  const now = Date.now();
  await drafts.updateOne(
    draftOf(owner.email, listName),
    {
      $addToSet: { [kind]: media },
      $set: { status: "unpaid", updatedAt: now },
      $setOnInsert: {
        id: nanoid(),
        ownerName: owner.name,
        ownerType: "user",
        links: [],
        messages: [],
        ...emptyMedia(kind),
        createdAt: now,
      },
    },
    { upsert: true }
  );
  const [signed] = await withUrls([media]);
  return signed;
}

export async function removeDraftMedia(ownerEmail: string, listName: string, kind: MediaKind, key: string) {
  const { modifiedCount } = await drafts.updateOne(draftOf(ownerEmail, listName), {
    $pull: { [kind]: { key } },
  });
  if (!modifiedCount) throw new HttpError(404, "File not found or already removed");
  if (!(await deleteFromS3(key))) {
    throw new HttpError(502, "Error deleting the file from AWS S3");
  }
}

export async function removeDraftLink(ownerEmail: string, listName: string, link: string) {
  const { matchedCount, modifiedCount } = await drafts.updateOne(draftOf(ownerEmail, listName), {
    $pull: { links: link },
  });
  if (!matchedCount) throw new HttpError(404, "Draft not found.");
  if (!modifiedCount) throw new HttpError(404, "Link not found in draft.");
}

export async function removeDraftMessage(ownerEmail: string, listName: string, message: string) {
  const { matchedCount, modifiedCount } = await drafts.updateOne(draftOf(ownerEmail, listName), {
    $pull: { messages: message },
  });
  if (!matchedCount) throw new HttpError(404, "Draft not found.");
  if (!modifiedCount) throw new HttpError(404, "Message not found in draft.");
}

/** Prices the draft from its stored items and opens a Razorpay order for it. */
export async function startCheckout(ownerEmail: string, listName: string): Promise<PaymentOrder> {
  const list = await lists.findOne({ ownerEmail, name: listName }, { projection: { paid: 1 } });
  if (!list) throw new HttpError(404, "List not found");
  if (!list.paid) throw new HttpError(409, "Pay for the list itself first");
  const draft = await drafts.findOne(draftOf(ownerEmail, listName));
  if (!draft) throw new HttpError(404, "Draft not found");

  const price = priceOf("draft", draft);
  if (price.blocker) throw new HttpError(400, price.blocker);

  const order = await createOrder(price.amount, {
    target: "draft",
    ownerEmail,
    listName,
    draftName: draft.draftName,
  });
  await drafts.updateOne({ _id: draft._id }, { $set: { pendingOrder: order } });
  return order;
}

/**
 * Moves the draft's items into its list, once `payment` checks out against the
 * order stored on the draft, then empties the draft.
 */
export async function confirmPayment(ownerEmail: string, listName: string, payment: CheckoutPayment) {
  const draft = await drafts.findOne(draftOf(ownerEmail, listName));
  if (!draft) throw new HttpError(404, "Draft not found");
  const order = draft.pendingOrder;
  if (!order) throw new HttpError(409, "No checkout in progress for this draft");

  await verifyPayment(order, payment);

  // Items added after checkout started were not paid for.
  if (priceOf("draft", draft).amount * 100 > order.amount) {
    throw new HttpError(409, "The draft changed after checkout started. Remove the new items and try again.");
  }
  // Empty the draft first, and only if it still holds exactly the items read
  // above: that way only paid-for items move, and a second confirm can't move
  // them again.
  const { modifiedCount } = await drafts.updateOne(
    {
      _id: draft._id,
      "pendingOrder.id": order.id,
      links: draft.links,
      messages: draft.messages,
      images: draft.images,
      videos: draft.videos,
      audios: draft.audios,
    },
    {
      $set: { status: "paid", links: [], messages: [], ...emptyMedia(), updatedAt: Date.now() },
      $unset: { pendingOrder: "" },
    }
  );
  if (!modifiedCount) {
    throw new HttpError(409, "The draft changed while confirming the payment. Please try again.");
  }

  const push: Partial<Record<"links" | "messages", { $each: string[] }> & Record<MediaKind, { $each: IMedia[] }>> = {};
  if (draft.links?.length) push.links = { $each: draft.links };
  if (draft.messages?.length) push.messages = { $each: draft.messages };
  for (const kind of MEDIA_KINDS) {
    if (draft[kind]?.length) push[kind] = { $each: draft[kind] };
  }

  // Nothing to push when every item was removed while checkout was open.
  const { matchedCount } = await lists.updateOne(
    { ownerEmail, name: listName },
    { ...(Object.keys(push).length > 0 && { $push: push }), $set: { updatedAt: Date.now() } }
  );
  if (!matchedCount) throw new HttpError(404, "List not found");
}
