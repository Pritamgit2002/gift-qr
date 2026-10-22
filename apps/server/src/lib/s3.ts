import { createHash } from "node:crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import type { IMedia, MediaItem, MediaKind } from "@giftqr/shared";
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

/** How long a signed link to a file works. */
const LINK_SECONDS = 60 * 60;

export type UploadedFile = { buffer: Buffer; mimetype: string };

// Keys show up in signed links, so a user's folder is named by a hash of their email, not the email.
const folderOf = (ownerEmail: string) =>
  createHash("sha256").update(ownerEmail.toLowerCase()).digest("hex").slice(0, 16);

// "image/jpeg" -> "jpg", "image/svg+xml" -> "svg", "audio/mpeg" -> "mpeg".
const extensionOf = (mimetype: string) => {
  const subtype = mimetype.split("/")[1]?.split("+")[0].replace(/[^a-z0-9]/gi, "").toLowerCase();
  return subtype === "jpeg" ? "jpg" : subtype || "bin";
};

/** Uploads a file under `users/<owner folder>/<kind>/` and returns its key. */
export async function uploadToS3(file: UploadedFile, ownerEmail: string, kind: MediaKind): Promise<string> {
  const key = `users/${folderOf(ownerEmail)}/${kind}/${nanoid()}.${extensionOf(file.mimetype)}`;
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
    throw new HttpError(502, "Error uploading the file to AWS S3");
  }
  return key;
}

/** Deletes an object by its key. Logs and returns false on failure. */
export async function deleteFromS3(key: string): Promise<boolean> {
  try {
    await s3().send(new DeleteObjectCommand({ Bucket: env.aws.bucket, Key: key }));
    return true;
  } catch (error) {
    await logger({ error: (error as Error).message, errorStack: (error as Error).stack, key });
    return false;
  }
}

/**
 * Adds a signed link to each file, since the bucket is private. Signing happens
 * locally, so this makes no request to AWS.
 */
export function withUrls(media: IMedia[] | undefined): Promise<MediaItem[]> {
  return Promise.all(
    (media ?? []).map(async (item) => ({
      ...item,
      url: await getSignedUrl(s3(), new GetObjectCommand({ Bucket: env.aws.bucket, Key: item.key }), {
        expiresIn: LINK_SECONDS,
      }),
    }))
  );
}
