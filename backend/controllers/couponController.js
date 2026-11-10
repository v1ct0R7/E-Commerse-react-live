import couponModel from "../models/couponModel.js";
import mongoose from "mongoose";

export const findActiveCoupon = async (code) => {
    if (typeof code !== "string" || !code.trim()) return null;
    return couponModel.findOne({
        code: code.trim().toUpperCase(),
        active: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });
};

export const validateCoupon = async (req, res) => {
    try {
        const coupon = await findActiveCoupon(req.body.code);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon is invalid or expired" });
        res.json({ success: true, data: { code: coupon.code, discountPercent: coupon.discountPercent } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to validate coupon" });
    }
};

export const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load coupons" });
    }
};

export const addCoupon = async (req, res) => {
    const code = typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";
    const discountPercent = Number(req.body.discountPercent);
    const expiresAt = typeof req.body.expiresAt === "string" ? new Date(`${req.body.expiresAt}T23:59:59.999Z`) : null;
    if (!/^[A-Z0-9_-]{3,32}$/.test(code || "") || !Number.isInteger(discountPercent) ||
        discountPercent < 1 || discountPercent > 90 ||
        (req.body.expiresAt && (typeof req.body.expiresAt !== "string" || !Number.isFinite(expiresAt?.getTime()) || expiresAt <= new Date()))) {
        return res.status(400).json({ success: false, message: "Enter a valid code, 1–90% discount, and future expiry date" });
    }
    try {
        const coupon = await couponModel.create({ code, discountPercent, expiresAt });
        res.status(201).json({ success: true, data: coupon, message: "Coupon created" });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ success: false, message: "Coupon code already exists" });
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to create coupon" });
    }
};

export const removeCoupon = async (req, res) => {
    if (!mongoose.isValidObjectId(req.body.id)) {
        return res.status(400).json({ success: false, message: "Valid coupon id is required" });
    }
    try {
        const coupon = await couponModel.findByIdAndDelete(req.body.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Coupon not found" });
        res.json({ success: true, message: "Coupon removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to remove coupon" });
    }
};
