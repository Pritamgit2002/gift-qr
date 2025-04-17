"use server";
import { IImage } from "@/models/list";
import { ServerActionResult } from "@/types";
import { getUser } from "./get-user";
import { auth } from "../auth";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";

export type GetImageOfListByNameResult = ServerActionResult<IImage[]>;

export type GetImageOfListByNameData = {
  ownerEmail: string;
  listName: string;
};

export const getImageOfListByName = async (
  data: GetImageOfListByNameData
): Promise<GetImageOfListByNameResult> => {
  try {
    if (!data?.ownerEmail || !data?.listName) {
      return {
        success: false,
        message: "Invalid email or list name provided",
      };
    }

    const session = await auth();

    if (session?.user?.email !== data?.ownerEmail) {
      return {
        success: false,
        message: "You are not authorized to access this list",
      };
    }

    const user = await getUser({ email: data.ownerEmail, type: "user" });

    if (!user.success) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await mongodb.connect();

    const ImageList = await mongodb.collection("list").findOne({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
    });

    if (!ImageList) {
      return {
        success: false,
        message: "List not found",
      };
    }

    return {
      success: true,
      data: ImageList.images,
      message: "List found",
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
