import express from "express";
import { getSettings, publicSettings, updateSettings } from "../controllers/settingsController.js";
import authMiddleware, { adminMiddleware } from "../middleware/auth.js";

const settingsRouter = express.Router();
settingsRouter.get("/public", publicSettings);
settingsRouter.get("/", authMiddleware, adminMiddleware, getSettings);
settingsRouter.patch("/", authMiddleware, adminMiddleware, updateSettings);

export default settingsRouter;
