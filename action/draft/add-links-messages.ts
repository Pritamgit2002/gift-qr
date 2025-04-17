"use server";

import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { auth } from "../../auth";
import { mongodb } from "@/lib/mongodb";
import { nanoid } from "nanoid";
import { fetchDraftByName } from "./fetch-draft-by-name";

export type AddLinksMessagesResult = ServerActionResult<undefined>;

export type AddLinksMessagesData = {
  ownerEmail: string;
  ownerType: "user";
  listName: string;
  draftName: string;
  links: string[];
  messages: string[];
  //images: File;
};

export const addLinksMessagesImagesinDraft = async (
  data: AddLinksMessagesData
): Promise<AddLinksMessagesResult> => {
  try {
    const session = await auth();
    if (data.ownerType === "user" && !session?.user) {
      return {
        success: false,
        message: "You must be logged in to add a list...",
      };
    }

    if (!data.links.length && !data.messages.length) {
      return {
        success: false,
        message: "You must add atleast one link or message or image",
      };
    }
    const existingDraft = await fetchDraftByName({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: "draft_" + data.listName,
    });

    await mongodb.connect();

    if (existingDraft.success) {
      const reponse = await mongodb.collection("draft").updateOne(
        {
          ownerEmail: data.ownerEmail,
          listName: data.listName,
          draftName: data.draftName,
        },
        {
          $set: {
            status: "unpaid",
            links: data.links,
            messages: data.messages,
            updatedAt: Date.now(),
          },
        }
      );
      if (!reponse.acknowledged) {
        return {
          success: false,
          message: "Error adding draft",
        };
      }
    } else {
      const reponse = await mongodb.collection("draft").insertOne({
        id: nanoid(),
        ownerEmail: data.ownerEmail,
        ownerName: session?.user.name,
        ownerType: data.ownerType,
        listName: data.listName,
        draftName: data.draftName,
        status: "unpaid",
        links: data.links,
        messages: data.messages,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      if (!reponse.acknowledged) {
        return {
          success: false,
          message: "Error adding draft",
        };
      }
    }

    return {
      success: true,
      data: undefined,
      message: "Item added in Draft successfully",
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while uploading image to list",
    };
  }
};
