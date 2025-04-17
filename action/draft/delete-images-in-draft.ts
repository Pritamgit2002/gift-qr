"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { deleteFromS3 } from "../aws/s3-delete";
import { IImage } from "@/models/list";

export type DeleteImagesInDraftResult = ServerActionResult<undefined>;
export type DeleteImagesInDraftData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
  imageUrl: IImage["url"];
};

export const deleteImagesInDraft = async (
  data: DeleteImagesInDraftData
): Promise<DeleteImagesInDraftResult> => {
  try {
    if (
      !data.ownerEmail ||
      !data.listName ||
      !data.draftName ||
      !data.imageUrl
    ) {
      return {
        success: false,
        message: "Invalid email or list name or link provided",
      };
    }
    await mongodb.connect();

    // Using $pull operator with a condition to remove the image object with matching url
    const response = await mongodb.collection("draft").updateOne(
      {
        ownerEmail: data.ownerEmail,
        listName: data.listName,
        draftName: data.draftName,
      },
      {
        $pull: {
          images: { url: data.imageUrl } as any,
        },
      }
    );

    if (!response.acknowledged) {
      return {
        success: false,
        message: "Error deleting Image from list",
      };
    }

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Image not found or already removed",
      };
    }

    const res = await deleteFromS3({
      url: data.imageUrl,
    });

    if (!res.success) {
      return {
        success: false,
        message: res.message,
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Image deleted successfully....",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: "Something went wrong while deleting Image from list",
    };
  }
};
