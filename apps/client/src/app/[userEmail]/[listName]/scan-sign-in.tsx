"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./reveal.module.css";

/**
 * Google sign-in that comes straight back to this gift. It always shows the
 * account chooser, so it also switches accounts.
 */
export function ScanSignIn({ label }: { label: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className={cn(styles.pill, "mt-3 bg-ribbon text-white")}
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void signIn("google", { callbackUrl: window.location.href }, { prompt: "select_account" });
      }}
    >
      {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
      {label}
    </button>
  );
}
