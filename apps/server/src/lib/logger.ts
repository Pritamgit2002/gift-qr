import { nanoid } from "nanoid";
import { logs } from "./mongodb.js";

/** Logs to stderr and keeps a copy in the `logs` collection. Never throws. */
export async function logger(info: Record<string, unknown>) {
  console.error(info);
  try {
    await logs.insertOne({
      id: nanoid(64),
      createdAt: Date.now(),
      info: JSON.stringify(info),
    });
  } catch {
    // Logging must never take the request down with it.
  }
}
