import { Router } from "express";
import { currentUser } from "../middleware/auth.js";
import { isMediaKind, parsePeaks } from "@giftqr/shared";
import { mediaUpload } from "../middleware/upload.js";
import { HttpError, ok, requireString, stringArray } from "../lib/http.js";
import * as listService from "../services/lists.js";
import { draftsRouter } from "./drafts.js";

/** The signed-in user's lists. */
export const listsRouter = Router();

listsRouter.get("/", async (req, res) => {
  res.json(ok(await listService.getLists(currentUser(req).email), "Lists retrieved successfully"));
});

// Other people's gifts that name the signed-in user. A guest's email is made up, so they have none.
listsRouter.get("/invited", async (req, res) => {
  const user = currentUser(req);
  const gifts = user.type === "guest" ? [] : await listService.getInvitedGifts(user.email);
  res.json(ok(gifts, "Invited gifts retrieved successfully"));
});

// Creates the list, or adds links/messages to it when it exists.
listsRouter.post("/", async (req, res) => {
  const result = await listService.addListOrItems(
    currentUser(req),
    requireString(req.body?.name, "name"),
    stringArray(req.body?.links),
    stringArray(req.body?.messages)
  );
  res
    .status(result === "created" ? 201 : 200)
    .json(ok(undefined, result === "created" ? "List added successfully" : "List updated successfully"));
});

listsRouter.delete("/:listName", async (req, res) => {
  await listService.deleteList(currentUser(req).email, req.params.listName);
  res.json(ok(undefined, `${req.params.listName} deleted successfully`));
});

listsRouter.delete("/:listName/links", async (req, res) => {
  const link = requireString(req.body?.link, "link");
  await listService.removeLink(currentUser(req).email, req.params.listName, link);
  res.json(ok(undefined, "Link deleted successfully"));
});

listsRouter.delete("/:listName/messages", async (req, res) => {
  const message = requireString(req.body?.message, "message");
  await listService.removeMessage(currentUser(req).email, req.params.listName, message);
  res.json(ok(undefined, "Message deleted successfully"));
});

listsRouter.put("/:listName/access", async (req, res) => {
  const emails = await listService.setAccess(
    currentUser(req).email,
    req.params.listName,
    stringArray(req.body?.emails)
  );
  res.json(ok(emails, emails.length ? "Only the people you added can open it" : "Anyone who scans it can open it"));
});

listsRouter.post("/:listName/media/:kind", mediaUpload, async (req, res) => {
  // mediaUpload has checked the kind; multer's handler type widens params, so narrow them back.
  const { listName, kind } = req.params as { listName: string; kind: string };
  if (!isMediaKind(kind)) throw new HttpError(404, "Unknown media type");
  if (!req.file) throw new HttpError(400, "file is required");
  const media = await listService.addMedia(
    currentUser(req).email,
    listName,
    kind,
    req.file,
    requireString(req.body?.name, "name"),
    parsePeaks(req.body?.peaks)
  );
  res.status(201).json(ok(media, "File uploaded successfully"));
});

listsRouter.delete("/:listName/media/:kind", async (req, res) => {
  const { kind } = req.params;
  if (!isMediaKind(kind)) throw new HttpError(404, "Unknown media type");
  await listService.removeMedia(currentUser(req).email, req.params.listName, kind, requireString(req.body?.key, "key"));
  res.json(ok(undefined, "File deleted successfully"));
});

listsRouter.use("/:listName/draft", draftsRouter);
