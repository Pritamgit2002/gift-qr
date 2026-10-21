import type { Request, RequestHandler } from "express";
import { decode } from "@auth/core/jwt";
import type { SessionUser } from "@giftqr/shared";
import { env } from "../config/env.js";
import { HttpError } from "../lib/http.js";

// Auth.js session cookie names; the __Secure- one is used over HTTPS.
// Large tokens are split into "<name>.0", "<name>.1", ... chunks.
const SESSION_COOKIES = ["__Secure-authjs.session-token", "authjs.session-token"];

function readSessionCookie(cookies: Record<string, string>) {
  for (const name of SESSION_COOKIES) {
    if (cookies[name]) return { name, value: cookies[name] };

    const chunks = Object.keys(cookies)
      .filter((key) => key.startsWith(`${name}.`))
      .sort((a, b) => Number(a.slice(name.length + 1)) - Number(b.slice(name.length + 1)));
    if (chunks.length) return { name, value: chunks.map((key) => cookies[key]).join("") };
  }
  return null;
}

/** Decodes the Next.js (Auth.js) session cookie, when there is one, into req.user. */
export const loadSession: RequestHandler = async (req, _res, next) => {
  const cookie = readSessionCookie(req.cookies ?? {});
  if (cookie) {
    try {
      const token = await decode({ token: cookie.value, secret: env.authSecret, salt: cookie.name });
      if (token?.user) req.user = token.user as SessionUser;
    } catch {
      // Expired or tampered cookie: carry on signed out.
    }
  }
  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!req.user) throw new HttpError(401, "You must be logged in");
  next();
};

/** The signed-in user. Only call this behind requireAuth. */
export const currentUser = (req: Request): SessionUser => req.user as SessionUser;
