import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "../../[userEmail]/[listName]/reveal";

export const metadata: Metadata = {
  title: "Audio reveal preview · GiftQR",
  robots: { index: false, follow: false },
};

// TODO(audio): remove once the server stores audio and a real list can be scanned.
// A scan page showing the audio surprise with a sample clip, for development only.
export default function AudioRevealPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return (
    <Reveal
      listName="Mom's 60th"
      surprise={{ kind: "audio", url: "/samples/voice-note.mp3", name: "Nani singing happy birthday" }}
    />
  );
}
