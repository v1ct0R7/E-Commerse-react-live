import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import couponRouter from "./routes/couponRoute.js";
import settingsRouter from "./routes/settingsRoute.js";
import { connectDB } from "./config/database.js";

const app = express();
const port = Number(process.env.PORT) || 4000;
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
const uploadsDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads");
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
  allowedHeaders: ["Content-Type", "token", "Authorization"],
}));
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) req.body = {};
  next();
});
app.use("/images", express.static(uploadsDir));

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/settings", settingsRouter);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Food Delivery API is running" });
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error.status === 400) {
    return res.status(400).json({ success: false, message: error.message });
  }
  console.error(error);
  res.status(500).json({ success: false, message: "Internal server error" });
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((error) => {
    console.error("Unable to start API:", error.message);
    process.exit(1);
  });
