"use server";

import { mongodb } from "@/lib/mongodb";
import { ServerActionResult } from "@/types";
import { fetchDraftByName } from "./fetch-draft-by-name";
import { getListByName } from "../get-list-by-name";
import { deleteDraftItems } from "./delete-draft-by-name";
import { logger } from "@/models/logger";
import { useLists } from "@/hooks/useLists";
import { auth } from "../../auth";

export type AddDraftToListResult = ServerActionResult<undefined>;
export type AddDraftToListData = {
  ownerEmail: string;
  listName: string;
  draftName: string;
};

export const addDraftToList = async (
  data: AddDraftToListData
): Promise<AddDraftToListResult> => {
  try {
    if (!data.ownerEmail || !data.listName || !data.draftName) {
      return {
        success: false,
        message: "Invalid email or list name or draft name provided",
      };
    }

    const draftExists = await fetchDraftByName({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: data.draftName,
    });

    if (!draftExists.success || !draftExists.data) {
      return {
        success: false,
        message: "Draft not found",
      };
    }

    const draft = draftExists.data;

    // Verify the list exists
    const listExists = await getListByName({
      email: data.ownerEmail,
      listName: data.listName,
    });

    if (!listExists.success) {
      return {
        success: false,
        message: "List not found",
      };
    }

    // Connect to MongoDB
    await mongodb.connect();

    // Create update object
    const updateObj: any = {
      $set: {
        updatedAt: new Date().getTime(),
      },
    };

    // Only add arrays that exist to the update
    if (draft.links && draft.links.length > 0) {
      updateObj.$push = updateObj.$push || {};
      updateObj.$push.links = { $each: draft.links };
    }

    if (draft.messages && draft.messages.length > 0) {
      updateObj.$push = updateObj.$push || {};
      updateObj.$push.messages = { $each: draft.messages };
    }

    if (draft.images && draft.images.length > 0) {
      updateObj.$push = updateObj.$push || {};
      updateObj.$push.images = { $each: draft.images };
    }

    // Check if we have any arrays to update
    if (!updateObj.$push) {
      return {
        success: false,
        message: "No valid content found in draft to add to list",
      };
    }

    const response = await mongodb.collection("list").updateOne(
      {
        ownerEmail: data.ownerEmail,
        name: data.listName,
      },
      {
        ...updateObj,
        $set: {
          ...(updateObj.$set || {}),
          updatedAt: Date.now(),
        },
      }
    );

    if (!response.acknowledged || response.modifiedCount === 0) {
      return {
        success: false,
        message: "Failed to update list with draft content",
      };
    }

    const deleteDraftRes = await deleteDraftItems({
      ownerEmail: data.ownerEmail,
      listName: data.listName,
      draftName: data.draftName,
    });

    if (!deleteDraftRes.success) {
      return {
        success: false,
        message: "Error deleting draft",
      };
    }

    return {
      success: true,
      data: undefined,
      message: "Draft successfully added to list and deleted",
    };
  } catch (error: any) {
    await logger({
      error,
      errorStack: error.stack,
    });

    console.error(
      `Error adding draft to list: ${
        error instanceof Error ? error.message : error
      }`
    );

    return {
      success: false,
      message: `Error adding draft to list: ${
        error instanceof Error ? error.message : error
      }`,
    };
  }
};
