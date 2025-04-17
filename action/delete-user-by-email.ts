"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { getUser } from "./get-user";
import { IUser } from "@/models/user";

export type DeleteUserByEmailResult = ServerActionResult<undefined>;

export type DeleteUserByEmailData = {
  email: string;
  type: IUser["type"];
};

export const deleteUserByEmail = async (data: DeleteUserByEmailData) => {
  try {
    if (!data?.email && data?.type === "user") {
      return {
        success: false,
        message: "Invalid email or type provided",
      };
    }

    const existingUser = await getUser({ email: data.email, type: data.type });

    if (!existingUser.success) {
      return {
        success: false,
        message: "User not found",
      };
    }

    await mongodb.connect();
    const res = await mongodb.collection("user").deleteOne({
      email: data.email,
    });

    if (!res.acknowledged) {
      return {
        success: false,
        message: "Error deleting user",
      };
    }

    if (data.type === "guest") {
      return {
        success: true,
        data: undefined,
        message: "Guest deleted successfully",
      };
    }
    return {
      success: true,
      data: undefined,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while deleting User",
    };
  }
};
