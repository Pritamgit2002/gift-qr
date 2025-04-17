import { IImage } from "@/models/list";

export const isValidLink = (url: string) => /\.\w+/.test(url);

export const formatUrl = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = "https://" + url;
  }
  if (!/^https?:\/\/www\./.test(url)) {
    url = url.replace(/^https?:\/\//, "https://www.");
  }
  return url;
};

export const getRandomItemfromArray = <T>(array: T[]): T | null => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const getRandomImagefromArray = (array: IImage[]) => {
  if (!array || array.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};
