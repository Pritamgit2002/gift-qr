import { nanoid } from "nanoid";
import {
  draftNameFor,
  MEDIA_KINDS,
  priceOf,
  type CheckoutPayment,
  type IList,
  type IMedia,
  type InvitedGift,
  type ListDetails,
  type ListSummary,
  type MediaItem,
  type MediaKind,
  type PaymentOrder,
  type SessionUser,
} from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { drafts, lists } from "../lib/mongodb.js";
import { deleteFromS3, uploadToS3, withUrls, type UploadedFile } from "../lib/s3.js";
import { createOrder, verifyPayment } from "./payments.js";

// Guest lists are free. A user's list is locked once paid: new items go into its
// draft, which is paid for separately.
const assertOpenForItems = (list: Pick<IList, "paid" | "ownerType">) => {
  if (list.paid && list.ownerType !== "guest") {
    throw new HttpError(409, "This list is paid for. Add new items to its draft instead.");
  }
};

export const GUESTS_CANT_UPLOAD = "Sign in with Google to add photos, videos and audio.";

/** The list's files, each with a signed link. */
const mediaOf = async (list: Pick<IList, MediaKind>) => {
  const [images, videos, audios] = await Promise.all(MEDIA_KINDS.map((kind) => withUrls(list[kind])));
  return { images, videos, audios };
};

/** Whether `viewer` may open the list: anyone, when it names no one; else its owner and the people it names. */
function assertCanOpen(list: Pick<IList, "ownerEmail" | "allowedEmails">, viewer: SessionUser | undefined) {
  const allowed = list.allowedEmails ?? [];
  if (!allowed.length) return;
  // A guest's email is made up, so it can't match an invitation.
  if (!viewer || viewer.type === "guest") {
    throw new HttpError(401, "This gift is only for the people it was sent to. Sign in to open it.", "sign-in-required");
  }
  const email = viewer.email.toLowerCase();
  if (email !== list.ownerEmail.toLowerCase() && !allowed.includes(email)) {
    throw new HttpError(403, "This gift wasn't sent to this account.", "not-invited");
  }
}

/** What a scanned QR code shows `viewer`. An unpaid list keeps its items to itself. */
export async function getListFor(
  viewer: SessionUser | undefined,
  ownerEmail: string,
  name: string
): Promise<ListDetails> {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");
  assertCanOpen(list, viewer);
  if (!list.paid) {
    return { name: list.name, links: [], messages: [], images: [], videos: [], audios: [], paid: false };
  }
  return {
    name: list.name,
    links: list.links ?? [],
    messages: list.messages ?? [],
    ...(await mediaOf(list)),
    paid: list.paid,
  };
}

export async function getLists(ownerEmail: string): Promise<ListSummary[]> {
  const found = await lists.find({ ownerEmail }).toArray();
  return Promise.all(
    found.map(async (list) => ({
      name: list.name,
      links: list.links ?? [],
      messages: list.messages ?? [],
      ...(await mediaOf(list)),
      paid: list.paid,
      allowedEmails: list.allowedEmails ?? [],
      updatedAt: list.updatedAt,
    }))
  );
}

/** Paid lists that name `email` among the people who may open them. */
export async function getInvitedGifts(email: string): Promise<InvitedGift[]> {
  const found = await lists
    .find(
      { allowedEmails: email.toLowerCase(), paid: true },
      { projection: { name: 1, ownerName: 1, ownerEmail: 1, updatedAt: 1 } }
    )
    .sort({ updatedAt: -1 })
    .toArray();
  return found.map((list) => ({
    listName: list.name,
    ownerName: list.ownerName,
    ownerEmail: list.ownerEmail,
    updatedAt: list.updatedAt,
  }));
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_INVITES = 50;

/**
 * Sets who may open the list's QR, besides its owner. No one means anyone who
 * scans it can. Free, and it can change after paying: the QR stays the same.
 */
export async function setAccess(ownerEmail: string, name: string, emails: string[]): Promise<string[]> {
  const owner = ownerEmail.toLowerCase();
  const cleaned = [...new Set(emails.map((email) => email.trim().toLowerCase()))].filter(
    (email) => email && email !== owner
  );
  const invalid = cleaned.find((email) => !EMAIL.test(email));
  if (invalid) throw new HttpError(400, `"${invalid}" isn't a valid email`);
  if (cleaned.length > MAX_INVITES) throw new HttpError(400, `A gift can be sent to up to ${MAX_INVITES} people`);

  const { matchedCount } = await lists.updateOne(
    { ownerEmail, name },
    { $set: { allowedEmails: cleaned, updatedAt: Date.now() } }
  );
  if (!matchedCount) throw new HttpError(404, "List not found");
  return cleaned;
}

/** Creates the list, or adds the links and messages to it when it already exists. */
export async function addListOrItems(
  owner: SessionUser,
  name: string,
  links: string[],
  messages: string[]
): Promise<"created" | "updated"> {
  const now = Date.now();
  const existing = await lists.findOne({ ownerEmail: owner.email, name });

  if (existing) {
    assertOpenForItems(existing);
    await lists.updateOne(
      { _id: existing._id },
      {
        $set: { updatedAt: now },
        $addToSet: { links: { $each: links }, messages: { $each: messages } },
      }
    );
    return "updated";
  }

  await lists.insertOne({
    id: nanoid(),
    ownerEmail: owner.email,
    ownerName: owner.name,
    ownerType: owner.type,
    name,
    links,
    messages,
    images: [],
    videos: [],
    audios: [],
    allowedEmails: [],
    // Guest lists are free; users pay before they can get the QR code.
    paid: owner.type === "guest",
    price: 0,
    createdAt: now,
    updatedAt: now,
  });
  return "created";
}

/** Deletes the list, its draft, and every file either of them uploaded. */
export async function deleteList(ownerEmail: string, name: string) {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");

  const draft = await drafts.findOne({ ownerEmail, listName: name, draftName: draftNameFor(name) });
  for (const kind of MEDIA_KINDS) {
    for (const media of [...(list[kind] ?? []), ...(draft?.[kind] ?? [])]) {
      await deleteFromS3(media.key);
    }
  }

  await lists.deleteOne({ _id: list._id });
  await drafts.deleteMany({ ownerEmail, listName: name });
}

export async function removeLink(ownerEmail: string, name: string, link: string) {
  const { modifiedCount } = await lists.updateOne({ ownerEmail, name }, { $pull: { links: link } });
  if (!modifiedCount) throw new HttpError(404, "Link not found or already removed");
}

export async function removeMessage(ownerEmail: string, name: string, message: string) {
  const { modifiedCount } = await lists.updateOne(
    { ownerEmail, name },
    { $pull: { messages: message } }
  );
  if (!modifiedCount) throw new HttpError(404, "Message not found or already removed");
}

export async function addMedia(
  ownerEmail: string,
  name: string,
  kind: MediaKind,
  file: UploadedFile,
  mediaName: string,
  peaks?: number[]
): Promise<MediaItem> {
  const list = await lists.findOne({ ownerEmail, name }, { projection: { paid: 1, ownerType: 1 } });
  if (!list) throw new HttpError(404, "No matching list found to update");
  if (list.ownerType === "guest") throw new HttpError(403, GUESTS_CANT_UPLOAD);
  assertOpenForItems(list);
  const media: IMedia = {
    name: mediaName,
    key: await uploadToS3(file, ownerEmail, kind),
    ...(kind === "audios" && peaks && { peaks }),
  };
  await lists.updateOne({ ownerEmail, name }, { $addToSet: { [kind]: media }, $set: { updatedAt: Date.now() } });
  const [signed] = await withUrls([media]);
  return signed;
}

export async function removeMedia(ownerEmail: string, name: string, kind: MediaKind, key: string) {
  const { matchedCount, modifiedCount } = await lists.updateOne(
    { ownerEmail, name },
    { $pull: { [kind]: { key } } }
  );
  if (!matchedCount) throw new HttpError(404, "No matching list found");
  if (!modifiedCount) throw new HttpError(404, "File not found or already removed");
  if (!(await deleteFromS3(key))) {
    throw new HttpError(502, "Error deleting the file from AWS S3");
  }
}

/** Prices the list from its stored items and opens a Razorpay order for it. */
export async function startCheckout(ownerEmail: string, name: string): Promise<PaymentOrder> {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");
  if (list.paid) throw new HttpError(409, "List is already paid");

  const price = priceOf("list", list);
  if (price.blocker) throw new HttpError(400, price.blocker);

  const order = await createOrder(price.amount, { target: "list", ownerEmail, listName: name });
  await lists.updateOne({ _id: list._id }, { $set: { pendingOrder: order } });
  return order;
}

/** Marks the list paid, once `payment` checks out against the order stored on it. */
export async function confirmPayment(ownerEmail: string, name: string, payment: CheckoutPayment) {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");
  if (list.paid) throw new HttpError(409, "List is already paid");
  const order = list.pendingOrder;
  if (!order) throw new HttpError(409, "No checkout in progress for this list");

  const paymentId = await verifyPayment(order, payment);

  // Items added after checkout started were not paid for.
  if (priceOf("list", list).amount * 100 > order.amount) {
    throw new HttpError(409, "The list changed after checkout started. Remove the new items and try again.");
  }
  // Matching the items read above means nothing was added in the meantime, and
  // matching the order means a second confirm can't apply it again.
  const { modifiedCount } = await lists.updateOne(
    {
      _id: list._id,
      "pendingOrder.id": order.id,
      links: list.links,
      messages: list.messages,
      images: list.images,
      videos: list.videos,
      audios: list.audios,
    },
    {
      $set: { paid: true, price: order.amount / 100, orderId: order.id, paymentId, updatedAt: Date.now() },
      $unset: { pendingOrder: "" },
    }
  );
  if (!modifiedCount) {
    throw new HttpError(409, "The list changed while confirming the payment. Please try again.");
  }
}
