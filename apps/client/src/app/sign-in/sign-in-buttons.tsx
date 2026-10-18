"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { UserRound } from "lucide-react";
import { GoogleMark } from "@/components/brand/art";
import { cn } from "@/lib/utils";
import styles from "./sign-in.module.css";

const AFTER_SIGN_IN = "/create-qr";

export function SignInButtons() {
  const [pending, setPending] = useState<"google" | "guest" | null>(null);

  const start = (provider: "google" | "guest") => {
    setPending(provider);
    // The guest provider is Auth.js credentials with just a display name.
    void (provider === "google"
      ? signIn("google", { callbackUrl: AFTER_SIGN_IN })
      : signIn("credentials", { name: "Guest", callbackUrl: AFTER_SIGN_IN }));
  };

  return (
    <div className="flex flex-col gap-3.5">
      <button
        type="button"
        className={cn(styles.button, styles.google)}
        disabled={pending !== null}
        onClick={() => start("google")}
      >
        <GoogleMark />
        {pending === "google" ? "Opening Google…" : "Continue with Google"}
      </button>
      <div className="flex items-center gap-3.5 text-sm text-plum-mute">
        <span className="h-px flex-1 bg-line-warm" />
        or
        <span className="h-px flex-1 bg-line-warm" />
      </div>
      <button
        type="button"
        className={cn(styles.button, styles.guest)}
        disabled={pending !== null}
        onClick={() => start("guest")}
      >
        <UserRound size={22} strokeWidth={2.2} aria-hidden="true" />
        {pending === "guest" ? "Signing you in…" : "Try it as a guest"}
      </button>
    </div>
  );
}
