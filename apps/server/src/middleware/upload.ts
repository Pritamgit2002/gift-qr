import type { RequestHandler } from "express";
import multer from "multer";
import { isMediaKind, MEDIA_RULES } from "@giftqr/shared";
import { HttpError } from "../lib/http.js";

const MB = 1024 * 1024;

/** One in-memory file from the "file" form field, checked against the rules for `:kind`. */
export const mediaUpload: RequestHandler = (req, res, next) => {
  const kind = req.params.kind;
  if (!isMediaKind(kind)) return next(new HttpError(404, "Unknown media type"));
  const rule = MEDIA_RULES[kind];

  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: rule.maxBytes, files: 1 },
    fileFilter: (_req, file, cb) => {
      if (file.mimetype.startsWith(rule.mimePrefix)) cb(null, true);
      else cb(new HttpError(400, `That file isn't a ${rule.noun}`));
    },
  }).single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
      return next(new HttpError(400, `A ${rule.noun} can be up to ${rule.maxBytes / MB} MB`));
    }
    next(error);
  });
};
