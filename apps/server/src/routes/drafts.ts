import { Router, type Request } from "express";
import { currentUser } from "../middleware/auth.js";
import { isMediaKind, parsePeaks } from "@giftqr/shared";
import { mediaUpload } from "../middleware/upload.js";
import { HttpError, ok, requireString, stringArray } from "../lib/http.js";
import * as draftService from "../services/drafts.js";

/** Mounted at /lists/:listName/draft. */
export const draftsRouter = Router({ mergeParams: true });

const listNameOf = (req: Request) => (req.params as { listName: string }).listName;

draftsRouter.get("/", async (req, res) => {
  const draft = await draftService.getDraft(currentUser(req).email, listNameOf(req));
  res.json(ok(draft, "Draft fetched successfully"));
});

draftsRouter.put("/", async (req, res) => {
  await draftService.saveDraftItems(
    currentUser(req),
    listNameOf(req),
    stringArray(req.body?.links),
    stringArray(req.body?.messages)
  );
  res.json(ok(undefined, "Item added in Draft successfully"));
});

draftsRouter.post("/media/:kind", mediaUpload, async (req, res) => {
  const { kind } = req.params as { kind: string };
  if (!isMediaKind(kind)) throw new HttpError(404, "Unknown media type");
  if (!req.file) throw new HttpError(400, "file is required");
  const media = await draftService.addDraftMedia(
    currentUser(req),
    listNameOf(req),
    kind,
    req.file,
    requireString(req.body?.name, "name"),
    parsePeaks(req.body?.peaks)
  );
  res.status(201).json(ok(media, "File added successfully"));
});

draftsRouter.delete("/media/:kind", async (req, res) => {
  const { kind } = req.params as { kind: string };
  if (!isMediaKind(kind)) throw new HttpError(404, "Unknown media type");
  await draftService.removeDraftMedia(currentUser(req).email, listNameOf(req), kind, requireString(req.body?.key, "key"));
  res.json(ok(undefined, "File deleted successfully"));
});

draftsRouter.delete("/links", async (req, res) => {
  const link = requireString(req.body?.link, "link");
  await draftService.removeDraftLink(currentUser(req).email, listNameOf(req), link);
  res.json(ok(undefined, "Link deleted successfully."));
});

draftsRouter.delete("/messages", async (req, res) => {
  const message = requireString(req.body?.message, "message");
  await draftService.removeDraftMessage(currentUser(req).email, listNameOf(req), message);
  res.json(ok(undefined, "Message deleted successfully."));
});
