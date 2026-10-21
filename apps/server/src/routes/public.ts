import { Router } from "express";
import { ok } from "../lib/http.js";
import * as listService from "../services/lists.js";

/** Routes that work without signing in. */
export const publicRouter = Router();

// What a scanned QR code reads.
publicRouter.get("/lists/:ownerEmail/:listName", async (req, res) => {
  const list = await listService.getList(req.params.ownerEmail, req.params.listName);
  res.json(ok(list, "List found"));
});
