"use server";

import { IList, listCollectionName } from "@/models/list";
import { ServerActionResult } from "@/types";
import { mongodb } from "@/lib/mongodb";
import { userCollectionName } from "@/models/user";
import { logger } from "@/models/logger";

export type GetListsResult = ServerActionResult<
  Pick<IList, "name" | "links" | "messages" | "images" | "paid" | "updatedAt">[]
>;

export type GetUserData = {
  email: string;
};

export const getLists = async (data: GetUserData): Promise<GetListsResult> => {
  try {
    console.log("pro star");
    if (!data?.email) {
      return {
        success: false,
        message: "Invalid email provided",
      };
    }

    await mongodb.connect();

    const user = await mongodb.collection(userCollectionName).findOne({
      email: data.email,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found..",
      };
    }

    const lists = await mongodb
      .collection(listCollectionName)
      .find({ ownerEmail: data.email })
      .toArray();

    //console.log("lists Server", lists);

    return {
      success: true,
      data: lists.map((list) => ({
        name: list.name,
        links: list.links || [], // Preserve links from database
        messages: list.messages || [], // Preserve messages from database
        images: list.images || [], // Preserve images from database
        paid: list.paid,
        updatedAt: list.updatedAt,
      })),
      message: "Lists retrieved successfully",
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
