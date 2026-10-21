import dotenv from "dotenv";

dotenv.config({ quiet: true });

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT ?? 4000),
  /** Must match the Next.js app's AUTH_SECRET so the server can read its session cookie. */
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? required("AUTH_SECRET"),
  mongoUrl: required("MONGODB_SERVER_URL"),
  mongoDbName: required("MONGODB_DB_NAME"),
  aws: {
    bucket: process.env.CUSTOM_AWS_BUCKET_NAME ?? "",
    region: process.env.CUSTOM_AWS_BUCKET_REGION ?? "",
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY ?? "",
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_KEY ?? "",
  },
  razorpay: {
    keyId: process.env.RAZORPAY_TEST_KEY_ID ?? "",
    keySecret: process.env.RAZORPAY_TEST_SECRET_KEY ?? "",
  },
};
