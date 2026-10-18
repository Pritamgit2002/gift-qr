import type { IImage } from "@giftqr/shared";

export const isValidLink = (url: string) => /\.\w+/.test(url);

export const formatUrl = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = "https://" + url;
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
