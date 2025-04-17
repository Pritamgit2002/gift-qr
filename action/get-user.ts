"use server";

import { IUser, userCollectionName } from "@/models/user";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";

export type GetUserResult = ServerActionResult<
  Pick<IUser, "id" | "name" | "email" | "avatar" | "type">
>;

export type GetUserData = {
  email: string;
  type?: IUser["type"];
};

export const getUser = async (data: GetUserData): Promise<GetUserResult> => {
  try {
    const session = await auth();

    if (data.type === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to get a user",
      };
    }

    await mongodb.connect();
    const user = await mongodb.collection(userCollectionName).findOne({
      email: session?.user?.email,
    });

    if (data.type === "user" && !user) {
      return {
        success: false,
        message: "User not found.",
      };
    } else if (data.type === "guest" && !user) {
      return {
        success: true,
        data: {
          id: "Guest-" + Math.floor(Math.random() * 10000),
          name: "Guest_Name " + Math.floor(Math.random() * 10000),
          email:
            "Guest_Name" + Math.floor(Math.random() * 10000) + "@gmail.com",
          avatar: "demo",
          type: "guest",
        } as unknown as Pick<
          IUser,
          "id" | "name" | "email" | "avatar" | "type"
        >,
        message: "User found",
      };
    }

    return {
      success: true,
      data: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        type: user?.type,
        avatar: user?.avatar,
      } as unknown as Pick<IUser, "id" | "name" | "email" | "avatar" | "type">,
      message: "User found",
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
