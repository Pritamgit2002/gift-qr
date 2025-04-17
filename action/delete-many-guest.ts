"use server";
import { mongodb } from "@/lib/mongodb";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";

export type DeleteManyGuestResult = ServerActionResult<undefined>;

export type DeleteManyGuestData = {
  email: string[];
};

export const deleteManyGuest = async (
  data: DeleteManyGuestData
): Promise<DeleteManyGuestResult> => {
  try {
    if (!data?.email) {
      return {
        success: false,
        message: "Invalid email provided",
      };
    }
    await mongodb.connect();
    const res = await mongodb.collection("user").deleteMany({
      email: { $in: data.email },
    });

    if (!res.acknowledged) {
      return {
        success: false,
        message: "Error deleting user",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Guest deleted successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: "Something went wrong while deleting Guest",
    };
  }
};
