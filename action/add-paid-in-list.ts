"use server";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { auth } from "../auth";
import { mongodb } from "@/lib/mongodb";
import { IUser } from "@/models/user";

export type AddPaidInListResult = ServerActionResult<undefined>;

type AddPaidInListData = {
  ownerEmail: string;
  listName: string;
  price: number;
  isPaid: boolean;
  ownerType: IUser["type"];
  paymentId: string;
  orderId: string;
};

export const addPaidInList = async (
  data: AddPaidInListData
): Promise<AddPaidInListResult> => {
  try {
    const session = await auth();
    if (data.ownerType === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to make Payment",
      };
    }

    await mongodb.connect();
    const response = await mongodb.collection("list").updateOne(
      {
        ownerEmail: data.ownerEmail,
        name: data.listName,
      },
      {
        $set: {
          paid: data.isPaid,
          price: data.price,
          paymentId: data.paymentId,
          orderId: data.orderId,
          updatedAt: Date.now(),
        },
      }
    );

    if (!response.acknowledged) {
      return {
        success: false,
        message: `Error updating ${data.listName} Payment Status`,
      };
    }

    return {
      success: true,
      data: undefined,
      message: `${data.listName} Payment Status Updated Successfully`,
    };
  } catch (error: any) {
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
