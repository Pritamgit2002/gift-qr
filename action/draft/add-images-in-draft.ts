"use server";

import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { fetchDraftByName } from "./fetch-draft-by-name";
import { uploadToS3 } from "../aws/s3-upload";
import { mongodb } from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { auth } from "../../auth";

export type AddImagesResult = ServerActionResult<undefined>;

export const addImagesInDraft = async (
  formData: FormData
): Promise<AddImagesResult> => {
  let uploadedS3Key = "";

  const ownerEmail = formData.get("ownerEmail") as string;
  const listName = formData.get("listName") as string;
  const draftName = formData.get("draftName") as string;
  const image = formData.get("image") as File;
  const imageName = formData.get("imageName") as string;

  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      message: "You must be logged in to add a list...",
    };
  }

  try {
    if (!image || !imageName) {
      return {
        success: false,
        message: "You must add at least one image",
      };
    }

    const uploadImageResult = await uploadToS3({
      file: image,
      fileName: listName,
      folderPath: "draft",
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

    const existingDraft = await fetchDraftByName({
      ownerEmail,
      listName,
      draftName: "draft_" + listName,
    });

    if (existingDraft.success) {
      const response = await mongodb.collection("draft").updateOne(
        {
          ownerEmail,
          listName,
          draftName,
        },
        {
          $addToSet: {
            images: {
              imageName: imageName,
              url: imageUrl,
            },
          },
          $set: {
            status: "unpaid",
            updatedAt: Date.now(),
          },
        }
      );

      if (!response.acknowledged) {
        return {
          success: false,
          message: "Error updating draft",
        };
      }
    } else {
      const response = await mongodb.collection("draft").insertOne({
        id: nanoid(),
        ownerEmail,
        ownerName: session.user.name,
        ownerType: "user",
        listName,
        draftName,
        status: "unpaid",
        links: [],
        messages: [],
        images: [
          {
            imageName: imageName,
            url: imageUrl,
          },
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      if (!response.acknowledged) {
        return {
          success: false,
          message: "Error inserting new draft",
        };
      }
    }

    return {
      success: true,
      data: undefined,
      message: "Image added successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    if (!uploadedS3Key) {
      return {
        success: false,
        message: "Something went wrong while uploading image to AWS S3 (Key)",
      };
    }

    return {
      success: false,
      message: "Something went wrong while uploading image to list",
    };
  }
};
