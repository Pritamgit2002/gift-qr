import type { IImage, ListDetails, ListSummary } from "@giftqr/shared";
import { request, seg } from "./client";

/** Public: what a scanned QR code shows. */
export const getListByName = (ownerEmail: string, listName: string) =>
  request<ListDetails>(`/public/lists/${seg(ownerEmail)}/${seg(listName)}`);

// The rest act on the signed-in user's lists.

export const getLists = () => request<ListSummary[]>("/lists");

/** Creates the list, or adds the links/messages to it when it already exists. */
export const saveList = (list: { name: string; links?: string[]; messages?: string[] }) =>
  request("/lists", { method: "POST", json: list });

export const deleteList = (listName: string) =>
  request(`/lists/${seg(listName)}`, { method: "DELETE" });

export const deleteLinkFromList = (listName: string, link: string) =>
  request(`/lists/${seg(listName)}/links`, { method: "DELETE", json: { link } });

export const deleteMessageFromList = (listName: string, message: string) =>
  request(`/lists/${seg(listName)}/messages`, { method: "DELETE", json: { message } });

export const uploadListImage = (listName: string, image: File, imageName: string) => {
  const body = new FormData();
  body.append("image", image);
  body.append("imageName", imageName);
  return request<IImage>(`/lists/${seg(listName)}/images`, { method: "POST", body });
};

export const deleteListImage = (listName: string, image: IImage) =>
  request(`/lists/${seg(listName)}/images`, {
    method: "DELETE",
    json: { imageName: image.imageName, imageUrl: image.url },
  });

export const markListPaid = (
  listName: string,
  payment: { price: number; paymentId: string; orderId: string }
) => request(`/lists/${seg(listName)}/payment`, { method: "POST", json: payment });
