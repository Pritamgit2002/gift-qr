import type { Metadata } from "next";
import type { ListDetails } from "@giftqr/shared";
import { getListByName } from "@/lib/api/lists";
import { Reveal, RevealNote, type Surprise } from "./reveal";

type Params = { params: { userEmail: string; listName: string } };

// A gift is for the person holding the code, not for search engines.
export const generateMetadata = ({ params }: Params): Metadata => ({
  title: `${decodeURIComponent(params.listName)} · GiftQR`,
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
    ...list.images.map((image): Surprise => ({ kind: "photo", url: image.url, name: image.imageName })),
    ...(list.audios ?? []).map(
      (audio): Surprise => ({ kind: "audio", url: audio.url, name: audio.audioName, duration: audio.duration })
    ),
  ];
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}

export default async function ScanPage({ params }: Params) {
  const ownerEmail = decodeURIComponent(params.userEmail);
  const listName = decodeURIComponent(params.listName);
  const response = await getListByName(ownerEmail, listName);

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
