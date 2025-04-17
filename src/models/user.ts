import { IList } from "./list";

export type IUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  links: IList[];
  type: "user" | "guest";
  createdAt: Date;
  updatedAt: Date;
};

export const userCollectionName = "user";
