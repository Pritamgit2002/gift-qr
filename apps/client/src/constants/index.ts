export const isValidLink = (url: string) => /\.\w+/.test(url);

export const formatUrl = (url: string): string => {
  if (!/^https?:\/\//.test(url)) {
    url = "https://" + url;
  }
  return url;
};
