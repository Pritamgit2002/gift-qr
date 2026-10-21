import { Router } from "express";
import { currentUser } from "../middleware/auth.js";
import { imageUpload } from "../middleware/upload.js";
import { HttpError, ok, requireString, stringArray } from "../lib/http.js";
import * as listService from "../services/lists.js";
import { draftsRouter } from "./drafts.js";

/** The signed-in user's lists. */
export const listsRouter = Router();

listsRouter.get("/", async (req, res) => {
  res.json(ok(await listService.getLists(currentUser(req).email), "Lists retrieved successfully"));
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

listsRouter.post("/:listName/images", imageUpload, async (req, res) => {
  if (!req.file) throw new HttpError(400, "image is required");
  const image = await listService.addImage(
    currentUser(req).email,
    // multer's handler type widens params, so narrow it back
    req.params.listName as string,
    req.file,
    requireString(req.body?.imageName, "imageName")
  );
  res.status(201).json(ok(image, "Image uploaded successfully"));
});

listsRouter.delete("/:listName/images", async (req, res) => {
  await listService.removeImage(currentUser(req).email, req.params.listName, {
    imageName: requireString(req.body?.imageName, "imageName"),
    url: requireString(req.body?.imageUrl, "imageUrl"),
  });
  res.json(ok(undefined, "Image deleted successfully"));
});

listsRouter.use("/:listName/draft", draftsRouter);
