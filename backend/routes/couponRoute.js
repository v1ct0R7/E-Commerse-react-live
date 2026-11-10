import express from "express";
import { addCoupon, listCoupons, removeCoupon, validateCoupon } from "../controllers/couponController.js";
import authMiddleware, { adminMiddleware } from "../middleware/auth.js";

const couponRouter = express.Router();
couponRouter.post("/validate", validateCoupon);
couponRouter.get("/list", authMiddleware, adminMiddleware, listCoupons);
couponRouter.post("/add", authMiddleware, adminMiddleware, addCoupon);
couponRouter.post("/remove", authMiddleware, adminMiddleware, removeCoupon);

export default couponRouter;
