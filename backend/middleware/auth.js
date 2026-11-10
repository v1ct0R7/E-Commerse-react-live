import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

const authMiddleware = async (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) {
        return res.status(401).json({ success: false, message: "Authentication required" })
    }
    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(tokenDecode.id).select("_id role");
        if (!user) return res.status(401).json({ success: false, message: "User account not found" });
        req.user = { id: user._id.toString(), role: user.role };
        next()
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        next(error);
    }

}

export default authMiddleware

export const adminMiddleware = (req, res, next) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({ success: false, message: "Administrator access required" });
    }
    next();
};