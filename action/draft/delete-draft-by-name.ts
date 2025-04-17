"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { fetchDraftByName } from "./fetch-draft-by-name";

export type DeleteDraftResult = ServerActionResult<undefined>;

export type DeleteDraftData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
};

export const deleteDraftItems = async (
  data: DeleteDraftData
): Promise<DeleteDraftResult> => {
  try {
    if (!data.ownerEmail || !data.listName || !data.draftName) {
      return {
        success: false,
        message: "Invalid email or list name or draft name provided",
      };
    }

    const isDraftExists = await fetchDraftByName({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: data.draftName,
    });

    if (!isDraftExists.success) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    const imageList = isDraftExists.data.images;

    await mongodb.connect();

    const response = await mongodb.collection("draft").updateOne(
      {
        ownerEmail: data.ownerEmail,
        listName: data.listName,
      },
      {
        $set: {
          status: "paid",
          links: [],
          images: [],
          messages: [],
        },
      }
    );

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Link not found or already removed",
      };
    }

    if (!response.acknowledged) {
      return {
        success: false,
        message: "Error deleting draft",
      };
    }

    // Delete the draft images
    // if (imageList) {
    //   for (const image of imageList) {
    //     await deleteFromS3({ url: image.url });
    //   }
    // }

    return {
      success: true,
      data: undefined,
      message: "Draft deleted successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting draft",
    };
  }
};
