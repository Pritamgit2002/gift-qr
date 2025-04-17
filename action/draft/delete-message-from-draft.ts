"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { fetchDraftByName } from "./fetch-draft-by-name";
import { auth } from "../../auth";
import { ServerActionResult } from "@/types";

export type DeleteMessageFromDraftResult = ServerActionResult<undefined>;

export type DeleteMessageFromDraftData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
  message: string;
};

export const deleteMessageFromDraft = async (
  data: DeleteMessageFromDraftData
): Promise<DeleteMessageFromDraftResult> => {
  try {
    const session = await auth();
    if (session?.user.email !== data.ownerEmail) {
      return {
        success: false,
        message: "You are not authorized to perform this action.",
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
        message: "Draft not found.",
      };
    }

    if (!isDraftExists.data.messages.includes(data.message)) {
      return {
        success: false,
        message: "Message not found in draft.",
      };
    }

    await mongodb.connect();
    const response = await mongodb.collection("draft").updateOne(
      {
        ownerEmail: data.ownerEmail,
        listName: data.listName,
        draftName: data.draftName,
      },
      {
        $pull: {
          messages: data.message as any,
        },
      }
    );

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Message not found or already removed",
      };
    }

    if (response.acknowledged) {
      return {
        success: true,
        data: undefined,
        message: "Message deleted successfully.",
      };
    }

    return {
      success: false,
      message: "Failed to delete message.",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting message from Draft",
    };
  }
};
