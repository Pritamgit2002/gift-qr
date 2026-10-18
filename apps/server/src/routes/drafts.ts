import { Router, type Request } from "express";
import { currentUser } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
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

draftsRouter.post("/images", imageUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, "You must add at least one image");
  const image = await draftService.addDraftImage(
    currentUser(req),
    listNameOf(req),
    req.file,
    requireString(req.body?.imageName, "imageName")
  );
  res.status(201).json(ok(image, "Image added successfully"));
});

draftsRouter.delete("/images", async (req, res) => {
  const imageUrl = requireString(req.body?.imageUrl, "imageUrl");
  await draftService.removeDraftImage(currentUser(req).email, listNameOf(req), imageUrl);
  res.json(ok(undefined, "Image deleted successfully"));
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
