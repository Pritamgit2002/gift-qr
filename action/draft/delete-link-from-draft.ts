"use server";
import { ServerActionResult } from "@/types";
import { fetchDraftByName } from "./fetch-draft-by-name";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { auth } from "../../auth";

export type DeleteLinkFromDraftResult = ServerActionResult<undefined>;

export type DeleteLinkFromDraftData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
  link: string;
};

export const deleteLinkFromDraft = async (
  data: DeleteLinkFromDraftData
): Promise<DeleteLinkFromDraftResult> => {
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

    if (!isDraftExists.data.links.includes(data.link)) {
      return {
        success: false,
        message: "Link not found in draft.",
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
          links: data.link as any,
        },
      }
    );

    if (response.modifiedCount === 0) {
      return {
        success: false,
        message: "Link not found or already removed",
      };
    }

    if (response.acknowledged) {
      return {
        success: true,
        data: undefined,
        message: "Link deleted successfully.",
      };
    }

    return {
      success: false,
      message: "Failed to delete link.",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting link from Draft",
    };
  }
};
