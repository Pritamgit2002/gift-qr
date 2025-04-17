"use server";
import { mongodb } from "@/lib/mongodb";
import { listCollectionName } from "@/models/list";
import { getLinkFromListByName } from "./get-link-from-list-by-name";
import { getUser } from "./get-user";
import { nanoid } from "nanoid";
import { logger } from "@/models/logger";
import { IUser } from "@/models/user";
import { auth } from "../auth";
import { ServerActionResult } from "@/types";

export type AddListResults = ServerActionResult<undefined>;

export type AddListData = {
  ownerEmail: string;
  ownerName: string;
  ownerType: IUser["type"];
  name: string;
  links?: string[];
  messages?: string[];
  isPaid: boolean;
  price?: number;
};

export const AddList = async (data: AddListData): Promise<AddListResults> => {
  try {
    const session = await auth();
    if (data.ownerType === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to add a list...",
      };
    }

    console.log("data");

    const userGetData = await getUser({
      email: data.ownerEmail,
      type: data.ownerType,
    });

    if (!userGetData.success) {
      return userGetData;
    }

    if (
      userGetData.data.type === "user" &&
      userGetData.data.email !== session?.user.email
    ) {
      return {
        success: false,
        message: "You are not the owner of this list",
      };
    }

    await mongodb.connect();
    const collection = mongodb.collection(listCollectionName);

    // Check if a list with the same name and owner already exists
    const existingList = await collection.findOne({
      ownerEmail: data.ownerEmail,
      name: data.name,
    });

    if (existingList) {
      // Check if any of the provided links already exist in the list
      let linkAlreadyExists = false;

      if (data.links && data.links.length > 0) {
        for (const link of data.links) {
          const isLinkAlreadyAdded = await getLinkFromListByName({
            ownerEmail: data.ownerEmail,
            listName: data.name,
            link: link,
          });

          if (isLinkAlreadyAdded.success) {
            linkAlreadyExists = true;
            break;
          }
        }

        if (linkAlreadyExists) {
          return {
            success: false,
            message: "One or more links already exist in the list",
          };
        }
      }

      // Update the existing list by adding the new links and messages
      const updateOps: any = {
        $set: {
          updatedAt: Date.now(),
        },
      };

      if (data.links && data.links.length > 0) {
        updateOps.$addToSet = {
          ...updateOps.$addToSet,
          links: { $each: data.links },
        };
      }

      if (data.messages && data.messages.length > 0) {
        updateOps.$addToSet = {
          ...updateOps.$addToSet,
          messages: { $each: data.messages },
        };
      }

      const updateResult = await collection.updateOne(
        { _id: existingList._id },
        updateOps
      );

      if (!updateResult.acknowledged) {
        return {
          success: false,
          message: "Error updating existing list",
        };
      }

      return {
        success: true,
        data: undefined,
        message: "List updated successfully",
      };
    } else {
      // Create a new list if it doesn't exist
      const id = nanoid();
      console.log("id", data.ownerEmail);

      const insertResult = await collection.insertOne({
        id,
        ownerEmail: data.ownerEmail,
        ownerName: data.ownerName,
        ownerType: data.ownerType,
        name: data.name,
        links: data.links || [],
        messages: data.messages || [],
        paid: data.isPaid,
        price: data.price || 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (!insertResult.acknowledged) {
        return {
          success: false,
          message: "Error adding new list",
        };
      }

      return {
        success: true,
        data: undefined,
        message: "List added successfully",
      };
    }
  } catch (error: any) {
    console.error("Error inside addList:", error);
    await logger({
      error,
      errorStack: error.stack,
    });
    return {
      success: false,
      message: `Error adding/updating list: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
