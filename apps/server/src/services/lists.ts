import { nanoid } from "nanoid";
import {
  draftNameFor,
  type IImage,
  type ListDetails,
  type ListSummary,
  type SessionUser,
} from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { drafts, lists } from "../lib/mongodb.js";
import { deleteFromS3, uploadToS3, type UploadedFile } from "../lib/s3.js";

export async function getList(ownerEmail: string, name: string): Promise<ListDetails> {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");
  return {
    name: list.name,
    links: list.links ?? [],
    messages: list.messages ?? [],
    images: list.images ?? [],
    paid: list.paid,
  };
}

export async function getLists(ownerEmail: string): Promise<ListSummary[]> {
  const found = await lists.find({ ownerEmail }).toArray();
  return found.map((list) => ({
    name: list.name,
    links: list.links ?? [],
    messages: list.messages ?? [],
    images: list.images ?? [],
    paid: list.paid,
    updatedAt: list.updatedAt,
  }));
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
    // Guest lists are free; users pay before they can get the QR code.
    paid: owner.type === "guest",
    price: 0,
    createdAt: now,
    updatedAt: now,
  });
  return "created";
}

/** Deletes the list, its draft, and every image either of them uploaded. */
export async function deleteList(ownerEmail: string, name: string) {
  const list = await lists.findOne({ ownerEmail, name });
  if (!list) throw new HttpError(404, "List not found");

  const draft = await drafts.findOne({ ownerEmail, listName: name, draftName: draftNameFor(name) });
  for (const image of [...(list.images ?? []), ...(draft?.images ?? [])]) {
    await deleteFromS3(image.url);
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

export async function addImage(
  ownerEmail: string,
  name: string,
  file: UploadedFile,
  imageName: string
): Promise<IImage> {
  if (!(await lists.findOne({ ownerEmail, name }, { projection: { _id: 1 } }))) {
    throw new HttpError(404, "No matching list found to update");
  }
  const image = { imageName, url: await uploadToS3(file, "images") };
  await lists.updateOne({ ownerEmail, name }, { $addToSet: { images: image } });
  return image;
}

export async function removeImage(ownerEmail: string, name: string, image: IImage) {
  const { matchedCount, modifiedCount } = await lists.updateOne(
    { ownerEmail, name },
    { $pull: { images: { imageName: image.imageName, url: image.url } } }
  );
  if (!matchedCount) throw new HttpError(404, "No matching list found");
  if (!modifiedCount) throw new HttpError(404, "Image not found or already removed");
  if (!(await deleteFromS3(image.url))) {
    throw new HttpError(502, "Error deleting image from AWS S3");
  }
}

export async function markPaid(
  ownerEmail: string,
  name: string,
  payment: { paid: boolean; price: number; paymentId: string; orderId: string }
) {
  const { matchedCount } = await lists.updateOne(
    { ownerEmail, name },
    { $set: { ...payment, updatedAt: Date.now() } }
  );
  if (!matchedCount) throw new HttpError(404, "List not found");
}
