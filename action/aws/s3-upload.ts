"use server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "@/models/logger";
import { ServerActionResult } from "@/types";
import { nanoid } from "nanoid";
import { s3 } from "@/lib/aws";

type UploadToS3Result = ServerActionResult<{
  url?: string;
}>;

type UploadToS3Data = {
  file: File;
  fileName: string;
  folderPath: string;
};

export const uploadToS3 = async (
  data: UploadToS3Data
): Promise<UploadToS3Result> => {
  try {
    // For FormData File objects, we need to ensure we can access arrayBuffer
    // This should work for both standard File objects and FormData File objects
    const fileBuffer = await data.file.arrayBuffer();
    const fullPath = `${data.folderPath.replace(/^\/+|\/+$/g, "")}/${nanoid()}`;

    const params = {
      Bucket: process.env.CUSTOM_AWS_BUCKET_NAME,
      Key: fullPath,
      Body: Buffer.from(fileBuffer),
      ContentType: data.file.type,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const url = `https://s3.${process.env.CUSTOM_AWS_BUCKET_REGION}.amazonaws.com/${process.env.CUSTOM_AWS_BUCKET_NAME}/${fullPath}`;

    return {
      success: true,
      data: {
        url: url,
      },
    };
  } catch (error: any) {
    await logger({
      error: error.message,
      errorStack: error.stack,
    });

    return {
      success: false,
      message: "Something went wrong while uploading file to S3",
    };
  }
};
