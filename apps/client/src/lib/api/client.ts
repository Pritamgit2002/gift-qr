import type { ApiResult } from "@giftqr/shared";

/**
 * In the browser, requests go through the Next.js rewrite at /api/server so the
 * session cookie rides along. On the server (e.g. the public QR page) they call
 * the API directly.
 */
const baseUrl = () =>
  typeof window === "undefined"
    ? process.env.SERVER_URL ?? "http://localhost:4000"
    : "/api/server";

type RequestOptions = Omit<RequestInit, "body"> & {
  /** Sent as a JSON body. */
  json?: unknown;
  body?: FormData;
};

export async function request<T = undefined>(
  path: string,
  { json, headers, ...init }: RequestOptions = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${baseUrl()}${path}`, {
      cache: "no-store",
      ...init,
      ...(json !== undefined && {
        body: JSON.stringify(json),
        headers: { "Content-Type": "application/json", ...headers },
      }),
    });
    return (await res.json()) as ApiResult<T>;
  } catch {
    return { success: false, message: "Could not reach the server. Please try again." };
  }
}

/** Encodes a path segment such as a list name or an email. */
export const seg = (value: string) => encodeURIComponent(value);
