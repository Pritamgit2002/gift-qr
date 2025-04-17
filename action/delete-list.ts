"use server";

import { mongodb } from "@/lib/mongodb";
import { IList, listCollectionName } from "@/models/list";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { logger } from "@/models/logger";
import { getListByName } from "./get-list-by-name";
import { deleteFromS3 } from "./aws/s3-delete";
import { fetchDraftByName } from "./draft/fetch-draft-by-name";

export type DeleteListResult = ServerActionResult<undefined>;

export type DeleteListData = {
  ownerEmail: string;
  listName: string;
  ownerType?: "user" | "guest";
};

export const deleteList = async (
  data: DeleteListData
): Promise<DeleteListResult> => {
  try {
    const ownerType = data.ownerType ?? "user";
    const session = await auth();

    if (ownerType === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to delete a lis..t",
      };
    }

    await mongodb.connect();

    // Fetch the list by name and owner ownerEmail
    const listToDelete = await getListByName({
      email: data.ownerEmail,
      listName: data.listName,
    });

    if (!listToDelete) {
      return {
        success: false,
        message: "List not found",
      };
    }

    if (listToDelete.success) {
      const imageList = listToDelete.data.images;
      if (imageList) {
        for (const image of imageList) {
          await deleteFromS3({ url: image.url });
        }
      }
    }

    // Delete the list
    await mongodb
      .collection(listCollectionName)
      .deleteOne({ name: data.listName, ownerEmail: data.ownerEmail });

    const draftItems = await fetchDraftByName({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: "draft_" + data.listName,
    });

    if (draftItems.success) {
      const imageList = draftItems.data.images;
      if (imageList) {
        for (const image of imageList) {
          await deleteFromS3({ url: image.url });
        }
      }
    } else {
      return {
        success: false,
        message:
          "Something went wrong while fetching draft items or Deleting Images",
      };
    }
    // Delete the draft
    await mongodb
      .collection("draft")
      .deleteMany({ listName: data.listName, ownerEmail: data.ownerEmail });

    return {
      success: true,
      data: undefined,
      message: `${data.listName} deleted successfully`,
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting the list",
    };
  }
};
