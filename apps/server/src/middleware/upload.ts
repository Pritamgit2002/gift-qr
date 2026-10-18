import multer from "multer";
import { HttpError } from "../lib/http.js";

/** One in-memory image from the "image" form field. */
export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new HttpError(400, "Only image files can be uploaded"));
  },
}).single("image");
