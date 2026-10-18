import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listsRouter } from "./lists.js";
import { paymentsRouter } from "./payments.js";
import { publicRouter } from "./public.js";
import { usersRouter } from "./users.js";

export const routes = Router();

routes.use("/public", publicRouter);
routes.use("/users", requireAuth, usersRouter);
routes.use("/lists", requireAuth, listsRouter);
routes.use("/payments", requireAuth, paymentsRouter);
