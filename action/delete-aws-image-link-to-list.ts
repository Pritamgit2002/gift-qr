"use server";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { deleteFromS3 } from "./aws/s3-delete";
import { getListByName } from "./get-list-by-name";

export type DeleteAwsImageLinkToListResult = ServerActionResult<undefined>;

export type DeleteAwsImageLinkToList = {
  ownerEmail: string;
  listName: string;
  imageName: string;
  imageUrl: string;
};

type ListDocument = {
  ownerEmail: string;
  name: string;
  images: Array<{
    imageName: string;
    url: string;
  }>;
  // other fields...
};

export const deleteAwsImageLinkToList = async (
  data: DeleteAwsImageLinkToList
): Promise<DeleteAwsImageLinkToListResult> => {
  try {
    const sessionData = await auth();
    if (!sessionData?.user) {
      return {
        success: false,
        message: "You must be logged in to upload an image to a list",
      };
    }

    const existList = await getListByName({
      email: data.ownerEmail,
      listName: data.listName,
    });

    if (!existList.success) {
      return {
        success: false,
        message: "No matching list found",
      };
    }

    await mongodb.connect();
    const result = await mongodb.collection<ListDocument>("list").updateOne(
      {
        ownerEmail: data.ownerEmail,
        name: data.listName,
      },
      {
        $pull: {
          images: {
            imageName: data.imageName,
            url: data.imageUrl,
          },
        },
      }
    );

    if (!result.acknowledged) {
      return {
        success: false,
        message: "Error deleting image from list",
      };
    }

    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: "Image not found or already removed",
      };
    }

    const responseFromS3 = await deleteFromS3({ url: data.imageUrl });

    if (!responseFromS3.success) {
      return {
        success: false,
        message: "Error deleting image from AWS S3",
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
      message: "Something went wrong while uploading image to list",
    };
  }
};
