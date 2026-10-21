import type { SessionUser } from "@giftqr/shared";

declare global {
  namespace Express {
    interface Request {
      /** Set by loadSession when the request carries a valid session cookie. */
      user?: SessionUser;
    }
  }
}

export {};
