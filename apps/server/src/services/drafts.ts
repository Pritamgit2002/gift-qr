import { nanoid } from "nanoid";
import { draftNameFor, type DraftDetails, type IImage, type SessionUser } from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { drafts, lists } from "../lib/mongodb.js";
import { deleteFromS3, uploadToS3, type UploadedFile } from "../lib/s3.js";

// A draft holds items added to an already-paid list until they are paid for and merged in.
const draftOf = (ownerEmail: string, listName: string) => ({
  ownerEmail,
  listName,
  draftName: draftNameFor(listName),
});

export async function getDraft(ownerEmail: string, listName: string): Promise<DraftDetails> {
  const draft = await drafts.findOne(draftOf(ownerEmail, listName));
  if (!draft) throw new HttpError(404, "Draft not found");
  return {
    links: draft.links ?? [],
    messages: draft.messages ?? [],
    images: draft.images ?? [],
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
      $setOnInsert: { id: nanoid(), ownerName: owner.name, ownerType: "user", images: [], createdAt: now },
    },
    { upsert: true }
  );
}

export async function addDraftImage(
  owner: SessionUser,
  listName: string,
  file: UploadedFile,
  imageName: string
): Promise<IImage> {
  const image = { imageName, url: await uploadToS3(file, "draft") };
  const now = Date.now();
  await drafts.updateOne(
    draftOf(owner.email, listName),
    {
      $addToSet: { images: image },
      $set: { status: "unpaid", updatedAt: now },
      $setOnInsert: { id: nanoid(), ownerName: owner.name, ownerType: "user", links: [], messages: [], createdAt: now },
    },
    { upsert: true }
  );
  return image;
}

export async function removeDraftImage(ownerEmail: string, listName: string, imageUrl: string) {
  const { modifiedCount } = await drafts.updateOne(draftOf(ownerEmail, listName), {
    $pull: { images: { url: imageUrl } },
  });
  if (!modifiedCount) throw new HttpError(404, "Image not found or already removed");
  if (!(await deleteFromS3(imageUrl))) {
    throw new HttpError(502, "Error deleting image from AWS S3");
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

/** Moves everything in the draft into its list, then empties the draft. */
export async function mergeDraft(ownerEmail: string, listName: string) {
  const draft = await drafts.findOne(draftOf(ownerEmail, listName));
  if (!draft) throw new HttpError(404, "Draft not found");

  const push: {
    links?: { $each: string[] };
    messages?: { $each: string[] };
    images?: { $each: IImage[] };
  } = {};
  if (draft.links?.length) push.links = { $each: draft.links };
  if (draft.messages?.length) push.messages = { $each: draft.messages };
  if (draft.images?.length) push.images = { $each: draft.images };
  if (!Object.keys(push).length) {
    throw new HttpError(400, "No valid content found in draft to add to list");
  }

  const { matchedCount } = await lists.updateOne(
    { ownerEmail, name: listName },
    { $push: push, $set: { updatedAt: Date.now() } }
  );
  if (!matchedCount) throw new HttpError(404, "List not found");

  await drafts.updateOne(draftOf(ownerEmail, listName), {
    $set: { status: "paid", links: [], messages: [], images: [] },
  });
}
