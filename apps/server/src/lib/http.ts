import type { ApiResult, ErrorCode } from "@giftqr/shared";

/** Thrown from services; the error handler turns it into `{ success: false, message, code }`. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly code?: ErrorCode
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export const ok = <T>(data: T, message?: string): ApiResult<T> => ({
  success: true,
  data,
  message,
});

/** Reads a required, non-blank string from request input. */
export function requireString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new HttpError(400, `${field} is required`);
  }
  return value;
}

export const stringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
