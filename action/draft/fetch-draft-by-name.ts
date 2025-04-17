"use server";

import { mongodb } from "@/lib/mongodb";
import { IDraft } from "@/models/draft";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";

export type FetchDraftByNameResult = ServerActionResult<
  Pick<IDraft, "links" | "messages" | "images" | "status">
>;

export type FetchDraftByNameData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
};

export const fetchDraftByName = async (
  data: FetchDraftByNameData
): Promise<FetchDraftByNameResult> => {
  try {
    if (!data.ownerEmail || !data.listName || !data.draftName) {
      return {
        success: false,
        message: "Invalid email or list name or draft name provided",
      };
    }

    await mongodb.connect();

    const response = await mongodb.collection("draft").findOne({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: data.draftName,
    });

    if (!response) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    return {
      success: true,
      data: {
        links: response.links,
        messages: response.messages,
        images: response.images,
        status: response.status,
      },
      message: "Draft fetched successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while fetching lists",
    };
  }
};
