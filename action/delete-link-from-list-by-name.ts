"use server";

import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";

export type DeleteLinkFromListByNameResult = ServerActionResult<undefined>;

export type DeleteLinkofListData = {
  ownerEmail: string;
  listName: string;
  link: string;
  ownerType?: string;
};

export const deleteLinkFromList = async (
  data: DeleteLinkofListData
): Promise<DeleteLinkFromListByNameResult> => {
  try {
    if (
      (data.ownerType === "guest" && !data.ownerEmail) ||
      !data.listName ||
      !data.link
    ) {
      return {
        success: false,
        message: "Invalid email or list name or link provided",
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
          links: data.link as any,
        },
      }
    );

    if (!response.acknowledged) {
      return {
        success: false,
        message: "Error deleting link from list",
      };
    }

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Link not found or already removed",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Link deleted successfully....",
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
