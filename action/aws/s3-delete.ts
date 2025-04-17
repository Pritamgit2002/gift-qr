import { s3 } from "@/lib/aws";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

type DeleteFromS3Result = ServerActionResult<undefined>;

type DeleteFromS3Data = {
  url: string;
};

export const deleteFromS3 = async (
  data: DeleteFromS3Data
): Promise<DeleteFromS3Result> => {
  try {
    const url = new URL(data.url);
    const key = url.pathname.substring(1);
    const actualKey = key.split("/").slice(1).join("/");

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.CUSTOM_AWS_BUCKET_NAME,
        Key: actualKey,
      })
    );
    return {
      success: true,
      data: undefined,
      message: "File deleted successfully",
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
