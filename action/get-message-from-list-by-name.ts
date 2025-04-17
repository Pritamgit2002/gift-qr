"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";

export type GetMessageFromListByNameResult = ServerActionResult<undefined>;

export type GetMessageFromListByName = {
  ownerEmail: string;
  listName: string;
  message: string;
};

export const getMessageFromListByName = async (
  data: GetMessageFromListByName
): Promise<GetMessageFromListByNameResult> => {
  try {
    if (!data?.ownerEmail || !data?.listName || !data?.message) {
      return {
        success: false,
        message: "Invalid email, list name or Message provided",
      };
    }

    await mongodb.connect();
    const list = await mongodb.collection("list").findOne({
      name: data.listName,
      ownerEmail: data.ownerEmail,
      messages: { $in: [data.message] },
    });

    if (!list) {
      return {
        success: false,
        message: "Message not found",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Message found",
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
