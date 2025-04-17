import { IDraft } from "./draft";
import { IUser } from "./user";

export type IImage = {
  imageName: string;
  url: string;
};
export type IList = {
  id: string;
  ownerEmail: IUser["email"];
  ownerName: IUser["name"];
  ownerType: IUser["type"];
  name: string;
  links: IUser["type"] extends "guest" ? [string, string] : string[];
  messages: IUser["type"] extends "guest" ? [string, string] : string[];
  images: IUser["type"] extends "guest" ? never : IImage[];
  //paid: IUser["type"] extends "guest" ? true : boolean;
  paid: boolean;
  price?: IUser["type"] extends "guest" ? never : number;
  paymentId?: IUser["type"] extends "guest" ? never : string;
  orderId?: IUser["type"] extends "guest" ? never : string;
  createdAt: number;
  updatedAt: number;
} & ({ paid: true; draft?: IDraft } | { paid: false });

export type IGuestList = Omit<IList, "images"> & {
  links: [string, string];
  messages: [string, string];
};

export const listCollectionName = "list";
