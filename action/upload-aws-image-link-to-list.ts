"use server";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { uploadToS3 } from "./aws/s3-upload";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";

export type UploadAwsImageLinkToListResult = ServerActionResult<undefined>;

export const uploadAwsImageLinkToList = async (
  formData: FormData
): Promise<UploadAwsImageLinkToListResult> => {
  let uploadedS3Key = "";

  try {
    const sessionData = await auth();
    if (!sessionData?.user) {
      return {
        success: false,
        message: "You must be logged in to upload an image to a list",
      };
    }

    const ownerEmail = formData.get("ownerEmail") as string;
    const listName = formData.get("listName") as string;
    const image = formData.get("image") as File;
    const imageName = formData.get("imageName") as string;

    if (ownerEmail !== sessionData.user.email) {
      return {
        success: false,
        message: "You are not the owner of this list",
      };
    }

    console.log("formData ", formData);
    const uploadImageResult = await uploadToS3({
      file: image,
      fileName: listName,
      folderPath: "images",
    });

    if (!uploadImageResult.success) {
      console.error("Error uploading image to AWS S3:", uploadImageResult);
      return {
        success: false,
        message: "Error uploading image to AWS S3",
      };
    }

    const imageUrl = uploadImageResult.data.url!;
    const s3Key = new URL(imageUrl).pathname.slice(1);
    uploadedS3Key = s3Key;

    await mongodb.connect();
    console.log("DB Update Query:", { ownerEmail, listName });

    const imageUploadedInDb = await mongodb.collection("list").updateOne(
      {
        ownerEmail: ownerEmail,
        name: listName,
      },
      {
        $addToSet: {
          images: {
            imageName: imageName,
            url: imageUrl,
          },
        },
      }
    );

    console.log("DB Update Result:", imageUploadedInDb);

    if (!imageUploadedInDb.acknowledged) {
      return {
        success: false,
        message: "Error uploading image to list",
      };
    }

    if (imageUploadedInDb.matchedCount === 0) {
      return {
        success: false,
        message: "No matching list found to update",
      };
    }

    if (imageUploadedInDb.modifiedCount === 0) {
      return {
        success: false,
        message: "List found but no changes were made",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Image uploaded successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });
    if (!uploadedS3Key) {
      return {
        success: false,
        message: "Something went wrong while uploading image to AWS S3(Key)",
      };
    }

    return {
      success: false,
      message: "Something went wrong while uploading image to list",
    };
  }
};
