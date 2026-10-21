import type { IList } from "./list.js";

export type UserType = "user" | "guest";

export type IUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  links: IList[];
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
};

/** The user stored in the session token, shared by the Next.js auth and the API server. */
export type SessionUser = Pick<IUser, "id" | "name" | "email" | "avatar" | "type">;
