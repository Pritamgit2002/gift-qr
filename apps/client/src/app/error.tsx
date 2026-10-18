"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/brand/button";
import { NoteScreen } from "@/components/brand/note-screen";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <NoteScreen note="oops…" title="This one came unwrapped." body="Something went wrong on our side. Give it another go, or head back home.">
      <button type="button" className={buttonVariants()} onClick={() => reset()}>
        Try again
      </button>
      <Link className={buttonVariants({ variant: "ghost" })} href="/">
        Back home
      </Link>
    </NoteScreen>
  );
}
