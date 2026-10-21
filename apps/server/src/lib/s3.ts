import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";
import { env } from "../config/env.js";
import { HttpError } from "./http.js";
import { logger } from "./logger.js";

let client: S3Client | undefined;

// Created on first use: the SDK throws without a region, and the rest of the API should still run.
function s3(): S3Client {
  client ??= new S3Client({
    region: env.aws.region,
    credentials: {
      accessKeyId: env.aws.accessKeyId,
      secretAccessKey: env.aws.secretAccessKey,
    },
  });
  return client;
}

export type UploadedFile = { buffer: Buffer; mimetype: string };

/** Uploads a file under `folder/` and returns its public URL. */
export async function uploadToS3(file: UploadedFile, folder: string): Promise<string> {
  const key = `${folder}/${nanoid()}`;
  try {
    await s3().send(
      new PutObjectCommand({
        Bucket: env.aws.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  } catch (error) {
    await logger({ error: (error as Error).message, errorStack: (error as Error).stack, key });
    throw new HttpError(502, "Error uploading image to AWS S3");
  }
  return `https://s3.${env.aws.region}.amazonaws.com/${env.aws.bucket}/${key}`;
}

/** Deletes an object by the URL uploadToS3 returned. Logs and returns false on failure. */
export async function deleteFromS3(url: string): Promise<boolean> {
  try {
    // The path is /<bucket>/<key>.
    const key = new URL(url).pathname.slice(1).split("/").slice(1).join("/");
    await s3().send(new DeleteObjectCommand({ Bucket: env.aws.bucket, Key: key }));
    return true;
  } catch (error) {
    await logger({ error: (error as Error).message, errorStack: (error as Error).stack, url });
    return false;
  }
}
