import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { closeDb } from "./lib/mongodb.js";

const server = createApp().listen(env.port, (error) => {
  if (error) throw error;
  console.log(`GiftQR API listening on http://localhost:${env.port}`);
});

const shutdown = () => {
  server.close(() => void closeDb().finally(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
