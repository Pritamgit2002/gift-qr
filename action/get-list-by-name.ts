"use server";
import { IList } from "@/models/list";
import { ServerActionResult } from "@/types";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";

export type GetListByNameResult = ServerActionResult<
  Pick<IList, "name" | "links" | "messages" | "images" | "paid">
>;

export type GetListByNameData = {
  email: string;
  listName: string;
};

export const getListByName = async (
  data: GetListByNameData
): Promise<GetListByNameResult> => {
  try {
    if (!data?.email || !data?.listName) {
      return {
        success: false,
        message: "Invalid email or list name provided",
      };
    }

    await mongodb.connect();
    const list = await mongodb
      .collection("list")
      .findOne({ name: data.listName, ownerEmail: data.email });

    if (!list) {
      return {
        success: false,
        message: "List not found",
      };
    }

    return {
      success: true,
      data: {
        name: list.name,
        links: list.links,
        messages: list.messages,
        images: list.images,
        paid: list.paid,
      },
      message: "List found",
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
