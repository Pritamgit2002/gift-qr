import type { SessionUser } from "@giftqr/shared";
import { request } from "./client";

// Every /users route acts on the signed-in user.
export const getCurrentUser = () => request<SessionUser>("/users/me");

export const addCurrentUser = () => request("/users/me", { method: "POST" });

export const deleteCurrentUser = () => request("/users/me", { method: "DELETE" });
