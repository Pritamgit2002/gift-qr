import type { SessionUser } from "@giftqr/shared";
import { HttpError } from "../lib/http.js";
import { users } from "../lib/mongodb.js";

export async function addUser(user: SessionUser) {
  if (await users.findOne({ email: user.email })) {
    throw new HttpError(409, "User already exists");
  }
  const now = Date.now();
  await users.insertOne({
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    type: user.type,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getUser(sessionUser: SessionUser): Promise<SessionUser> {
  const user = await users.findOne({ email: sessionUser.email });
  if (user) {
    return { id: user.id, name: user.name, email: user.email, avatar: user.avatar, type: user.type };
  }
  // A guest may not be saved yet, and their session already has everything.
  if (sessionUser.type === "guest") return sessionUser;
  throw new HttpError(404, "User not found.");
}

export async function deleteUser(email: string) {
  const { deletedCount } = await users.deleteOne({ email });
  if (!deletedCount) throw new HttpError(404, "User not found");
}
