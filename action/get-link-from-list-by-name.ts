"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
export type GetLinkFromListByNameResult = ServerActionResult<undefined>;

export type GetLinkFromListByName = {
  ownerEmail: string;
  listName: string;
  link?: string;
  message?: string;
};
export const getLinkFromListByName = async (
  data: GetLinkFromListByName
): Promise<GetLinkFromListByNameResult> => {
  try {
    if (!data?.ownerEmail || !data?.listName || !data?.link || data?.message) {
      return {
        success: false,
        message: "Invalid email, list name , link or message provided",
      };
    }

    await mongodb.connect();

    const existsLink = await mongodb.collection("list").findOne({
      name: data.listName,
      ownerEmail: data.ownerEmail,
      links: { $in: [data.link] },
    });

    const existsMessage = await mongodb.collection("list").findOne({
      name: data.listName,
      ownerEmail: data.ownerEmail,
      messages: { $in: [data.message] },
    });

    if (!existsLink) {
      return {
        success: false,
        message: "Link not found",
      };
    }

    if (!existsMessage) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Link found",
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
