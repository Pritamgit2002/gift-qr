import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/brand/button";
import { NoteScreen } from "@/components/brand/note-screen";

export const metadata: Metadata = {
  title: "Page not found | GiftQR",
};

export default function NotFound() {
  return (
    <NoteScreen note="hmm…" title="We can't find that page." body="It may have moved, or the link has a typo in it.">
      <Link className={buttonVariants()} href="/">
        Take me home
      </Link>
    </NoteScreen>
  );
}
