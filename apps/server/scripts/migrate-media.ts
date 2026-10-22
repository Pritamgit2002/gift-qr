/**
 * One-off: moves stored media to the { name, key } shape and gives every list and
 * draft the fields added with videos, audio and invitations. Safe to run again.
 *
 *   npm run migrate:media -w @giftqr/server
 */
import type { Collection, Document } from "mongodb";
import { closeDb, drafts, lists } from "../src/lib/mongodb.js";

type LegacyImage = { imageName?: string; name?: string; url?: string; key?: string };

/** Uploads used to store a path-style URL: https://s3.<region>.amazonaws.com/<bucket>/<key>. */
const keyOf = (url: string) => new URL(url).pathname.slice(1).split("/").slice(1).join("/");

function migrateImages(images: LegacyImage[] | undefined) {
  return (images ?? []).map((image) =>
    image.key ? image : { name: image.name ?? image.imageName ?? "Photo", key: keyOf(image.url ?? "") }
  );
}

async function migrate(collection: Collection<Document>, extra: Document) {
  let changed = 0;
  for await (const doc of collection.find({})) {
    const images = migrateImages(doc.images);
    const set: Document = {};
    if (JSON.stringify(images) !== JSON.stringify(doc.images ?? [])) set.images = images;
    if (!Array.isArray(doc.videos)) set.videos = [];
    if (!Array.isArray(doc.audios)) set.audios = [];
    for (const [field, value] of Object.entries(extra)) {
      if (doc[field] === undefined) set[field] = value;
    }
    if (Object.keys(set).length) {
      await collection.updateOne({ _id: doc._id }, { $set: set });
      changed += 1;
    }
  }
  return changed;
}

try {
  const listCount = await migrate(lists as unknown as Collection<Document>, { allowedEmails: [] });
  const draftCount = await migrate(drafts as unknown as Collection<Document>, {});
  console.log(`Updated ${listCount} lists and ${draftCount} drafts.`);
} finally {
  await closeDb();
}
