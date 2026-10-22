import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { closeDb, lists } from "./lib/mongodb.js";
import { logger } from "./lib/logger.js";

// Finds the gifts a user was invited to. Creating an index that exists is a no-op.
lists.createIndex({ allowedEmails: 1 }).catch((error: Error) => void logger({ error: error.message }));

const server = createApp().listen(env.port, (error) => {
  if (error) throw error;
  console.log(`GiftQR API listening on http://localhost:${env.port}`);
});

const shutdown = () => {
  server.close(() => void closeDb().finally(() => process.exit(0)));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
