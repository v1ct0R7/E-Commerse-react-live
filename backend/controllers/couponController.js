import couponModel from "../models/couponModel.js";
import { isValidId } from "../utils/validation.js";

export const findActiveCoupon = async (code) => {
    if (typeof code !== "string" || !code.trim()) return null;
    return couponModel.findActiveByCode(code.trim().toUpperCase());
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
        const coupons = await couponModel.findAll();
        res.json({ success: true, data: coupons });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load coupons" });
    }
};

export const addCoupon = async (req, res) => {
    const code = typeof req.body.code === "string" ? req.body.code.trim().toUpperCase() : "";
    const discountPercent = Number(req.body.discountPercent);
    let expiresAt = null;
    if (req.body.expiresAt) {
        // data vjen nga input type="date" (YYYY-MM-DD); kuponi vlen deri ne fund te asaj dite
        expiresAt = /^\d{4}-\d{2}-\d{2}$/.test(req.body.expiresAt) ? new Date(`${req.body.expiresAt}T23:59:59`) : null;
        if (!expiresAt || !Number.isFinite(expiresAt.getTime()) || expiresAt <= new Date()) {
            return res.status(400).json({ success: false, message: "Expiry date must be a valid future date" });
        }
    }
    if (!/^[A-Z0-9_-]{3,32}$/.test(code) || !Number.isInteger(discountPercent) || discountPercent < 1 || discountPercent > 90) {
        return res.status(400).json({ success: false, message: "Enter a valid code (3–32 letters/numbers) and a 1–90% discount" });
    }
    try {
        const coupon = await couponModel.create({ code, discountPercent, expiresAt });
        res.status(201).json({ success: true, data: coupon, message: "Coupon created" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "Coupon code already exists" });
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to create coupon" });
    }
};

export const removeCoupon = async (req, res) => {
    if (!isValidId(req.body.id)) {
        return res.status(400).json({ success: false, message: "Valid coupon id is required" });
    }
    try {
        const removed = await couponModel.remove(req.body.id);
        if (!removed) return res.status(404).json({ success: false, message: "Coupon not found" });
        res.json({ success: true, message: "Coupon removed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to remove coupon" });
    }
};
