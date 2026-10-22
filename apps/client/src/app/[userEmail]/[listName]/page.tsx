import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ListDetails } from "@giftqr/shared";
import { auth } from "../../../../auth";
import { getListByName } from "@/lib/api/lists";
import { Reveal, RevealNote, type Surprise } from "./reveal";
import { ScanSignIn } from "./scan-sign-in";

type Params = { params: Promise<{ userEmail: string; listName: string }> };

// A gift is for the person holding the code, not for search engines.
export const generateMetadata = async ({ params }: Params): Promise<Metadata> => ({
  title: `${decodeURIComponent((await params).listName)} · GiftQR`,
  robots: { index: false, follow: false },
});

/** Only http(s) links are followed; anything else could run script on this page. */
function safeLink(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** One item, picked at random from everything in the list. */
function pickSurprise(list: ListDetails): Surprise | null {
  const links = list.links.map(safeLink).filter((url): url is URL => url !== null);
  const pool: Surprise[] = [
    ...links.map((url): Surprise => ({ kind: "link", url: url.href, host: url.hostname.replace(/^www\./, "") })),
    ...list.messages.map((text): Surprise => ({ kind: "message", text })),
    ...list.images.map((image): Surprise => ({ kind: "photo", url: image.url, name: image.name })),
    ...list.videos.map((video): Surprise => ({ kind: "video", url: video.url, name: video.name })),
    ...list.audios.map((audio): Surprise => ({ kind: "audio", url: audio.url, name: audio.name, peaks: audio.peaks })),
  ];
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

export default async function ScanPage({ params }: Params) {
  const { userEmail, listName: rawListName } = await params;
  const ownerEmail = decodeURIComponent(userEmail);
  const listName = decodeURIComponent(rawListName);
  // The API reads the viewer's session from these, for gifts sent to particular people.
  const response = await getListByName(ownerEmail, listName, (await cookies()).toString());

  if (!response.success && response.code === "sign-in-required") {
    return (
      <RevealNote
        listName={listName}
        note="psst… it's addressed"
        title="This gift is for someone special."
        body="Sign in with the Google account it was sent to, and it's all yours."
        action={<ScanSignIn label="Sign in with Google" />}
      />
    );
  }
  if (!response.success && response.code === "not-invited") {
    const email = (await auth())?.user?.email;
    return (
      <RevealNote
        listName={listName}
        note="wrong mailbox?"
        title="This gift wasn't sent to you."
        body={`You're signed in as ${email ?? "another account"}. If it was sent to a different email, switch to that account.`}
        action={<ScanSignIn label="Switch account" />}
      />
    );
  }
  if (!response.success) {
    return (
      <RevealNote
        listName={listName}
        note="hmm…"
        title="We couldn't find this gift."
        body="The code may be mistyped, or its list was deleted."
      />
    );
  }
  if (!response.data.paid) {
    return (
      <RevealNote
        listName={listName}
        note="not yet!"
        title="This gift is still being wrapped."
        body="Its maker hasn't unlocked it yet. Try scanning again a little later."
      />
    );
  }

  const surprise = pickSurprise(response.data);
  if (!surprise) {
    return (
      <RevealNote
        listName={listName}
        note="almost…"
        title="Nothing is inside yet."
        body="Its maker is still packing it. Try scanning again a little later."
      />
    );
  }
  return <Reveal listName={listName} surprise={surprise} />;
}
