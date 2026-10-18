import { Router } from "express";
import { currentUser } from "../middleware/auth.js";
import { ok } from "../lib/http.js";
import * as userService from "../services/users.js";

export const usersRouter = Router();

usersRouter.get("/me", async (req, res) => {
  res.json(ok(await userService.getUser(currentUser(req)), "User found"));
});

usersRouter.post("/me", async (req, res) => {
  await userService.addUser(currentUser(req));
  res.status(201).json(ok(undefined, "User added successfully"));
});

usersRouter.delete("/me", async (req, res) => {
  const user = currentUser(req);
  await userService.deleteUser(user.email);
  res.json(ok(undefined, `${user.type === "guest" ? "Guest" : "User"} deleted successfully`));
});
