import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import { randomUUID } from "node:crypto";
import authMiddleware, { adminMiddleware } from "../middleware/auth.js";
import { uploadsDir } from "../config/uploads.js";

const foodRouter = express.Router();
const imageExtensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
};

// image storaga engine

const storage = multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
        cb(null, `${randomUUID()}${imageExtensions[file.mimetype]}`);
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!Object.hasOwn(imageExtensions, file.mimetype)) {
            const error = new Error("Upload a JPEG, PNG, WebP or GIF image");
            error.status = 400;
            return cb(error);
        }
        cb(null, true);
    },
});
foodRouter.post("/add", authMiddleware, adminMiddleware, upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", authMiddleware, adminMiddleware, removeFood);












export default foodRouter;