import express from "express";
import cookieParser from "cookie-parser";
import { loadSession } from "./middleware/auth.js";
import { errorHandler, notFound } from "./middleware/error-handler.js";
import { routes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(loadSession);

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });
  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
