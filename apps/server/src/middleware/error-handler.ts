import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { HttpError } from "../lib/http.js";
import { logger } from "../lib/logger.js";

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
};

export const errorHandler: ErrorRequestHandler = async (err, req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ success: false, message: err.message, code: err.code });
    return;
  }
  if (err instanceof multer.MulterError) {
    res.status(400).json({ success: false, message: err.message });
    return;
  }
  if (err?.type === "entity.parse.failed") {
    res.status(400).json({ success: false, message: "Invalid JSON body" });
    return;
  }

  await logger({ error: err?.message, errorStack: err?.stack, method: req.method, path: req.path });
  res.status(500).json({ success: false, message: "Something went wrong" });
};
