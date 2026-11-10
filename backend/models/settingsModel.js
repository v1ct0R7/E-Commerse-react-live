import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
    _id: { type: String, default: "store" },
    deliveryFee: { type: Number, required: true, min: 0, default: 2 },
    currency: { type: String, enum: ["eur"], default: "eur" },
}, { versionKey: false });

const settingsModel = mongoose.models.settings || mongoose.model("settings", settingsSchema);
export default settingsModel;
