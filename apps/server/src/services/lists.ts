import { nanoid } from "nanoid";
import {
  draftNameFor,
  priceOf,
  type CheckoutPayment,
  type IImage,
  type IList,
  type ListDetails,
  type ListSummary,
  type PaymentOrder,
  type SessionUser,
} from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { drafts, lists } from "../lib/mongodb.js";
import { deleteFromS3, uploadToS3, type UploadedFile } from "../lib/s3.js";
import { createOrder, verifyPayment } from "./payments.js";

// Guest lists are free. A user's list is locked once paid: new items go into its
// draft, which is paid for separately.
const assertOpenForItems = (list: Pick<IList, "paid" | "ownerType">) => {
  if (list.paid && list.ownerType !== "guest") {
    throw new HttpError(409, "This list is paid for. Add new items to its draft instead.");
  }
};

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
  const list = await lists.findOne({ ownerEmail, name }, { projection: { paid: 1, ownerType: 1 } });
  if (!list) throw new HttpError(404, "No matching list found to update");
  assertOpenForItems(list);
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
