"use server";

import { mongodb } from "@/lib/mongodb";
import { userCollectionName } from "@/models/user";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { logger } from "@/models/logger";

export type AddUserResult = ServerActionResult<undefined>;

type AddUserData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  type: "user" | "guest";
};

export const addUser = async (data: AddUserData): Promise<AddUserResult> => {
  try {
    const session = await auth();
    if (data.type === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to add a user",
      };
    }

    await mongodb.connect();
    const userData = await mongodb
      .collection(userCollectionName)
      .findOne({ email: session?.user.email });

    if (userData) {
      return {
        success: false,
        message: "User already exists",
      };
    }

    console.log("data is : ", data);

    const res = await mongodb.collection(userCollectionName).insertOne({
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      type: data.type,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log("result is : ", res.acknowledged);

    if (!res.acknowledged) {
      return {
        success: false,
        message: "Error adding user one",
      };
    }
    return {
      success: true,
      data: res.acknowledged as any,
      message: "User added successfully",
    };
  } catch (error: any) {
    //console.error("Error inside addUser:", error);
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error adding user: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
