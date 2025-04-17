"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";

export type DeleteMessageFromListByNameResult = ServerActionResult<undefined>;

export type DeleteMessageofListData = {
  ownerEmail: string;
  listName: string;
  message: string;
  ownerType?: string;
};

export const deleteMessageFromList = async (
  data: DeleteMessageofListData
): Promise<DeleteMessageFromListByNameResult> => {
  try {
    if (
      (data.ownerType === "guest" && !data?.ownerEmail) ||
      !data?.listName ||
      !data?.message
    ) {
      return {
        success: false,
        message: "Invalid email or list name or message provided",
      };
    }

    await mongodb.connect();

    // Using $pull operator to remove the matching link from the links array
    const response = await mongodb.collection("list").updateOne(
      {
        ownerEmail: data.ownerEmail,
        name: data.listName,
      },
      {
        $pull: {
          messages: data.message as any,
        },
      }
    );

    if (!response.acknowledged) {
      return {
        success: false,
        message: "Error deleting message from list",
      };
    }

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Message not found or already removed",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Message deleted successfully....",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting link from list",
    };
  }
};
