import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_BUCKET_REGION ?? "",
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY ?? "",
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY ?? "",
  },
});

export { s3 };
