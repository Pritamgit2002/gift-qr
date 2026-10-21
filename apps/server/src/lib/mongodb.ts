import { MongoClient } from "mongodb";
import type { IDraft, IList, SessionUser } from "@giftqr/shared";
import { env } from "../config/env.js";

export type UserDoc = SessionUser & { createdAt: number; updatedAt: number };
export type LogDoc = { id: string; createdAt: number; info: string };

// The driver connects on the first query, so nothing needs to await a connect() call.
const client = new MongoClient(env.mongoUrl);
const db = client.db(env.mongoDbName);

export const users = db.collection<UserDoc>("user");
export const lists = db.collection<IList>("list");
export const drafts = db.collection<IDraft>("draft");
export const logs = db.collection<LogDoc>("logs");

export const closeDb = () => client.close();
