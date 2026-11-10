import settingsModel from "../models/settingsModel.js";

const readSettings = async () => settingsModel.findOneAndUpdate(
    { _id: "store" },
    { $setOnInsert: { deliveryFee: 2, currency: "eur" } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
);

export const publicSettings = async (req, res) => {
    try {
        const settings = await readSettings();
        res.json({ success: true, data: { deliveryFee: settings.deliveryFee, currency: settings.currency } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load store settings" });
    }
};

export const getSettings = async (req, res) => {
    try {
        const settings = await readSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load store settings" });
    }
};

export const updateSettings = async (req, res) => {
    const deliveryFee = Number(req.body.deliveryFee);
    if (!Number.isFinite(deliveryFee) || deliveryFee < 0 || deliveryFee > 100) {
        return res.status(400).json({ success: false, message: "Delivery fee must be between €0 and €100" });
    }
    try {
        const settings = await settingsModel.findOneAndUpdate(
            { _id: "store" },
            { $set: { deliveryFee: Math.round(deliveryFee * 100) / 100, currency: "eur" } },
            { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
        );
        res.json({ success: true, data: settings, message: "Store settings updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update store settings" });
    }
};
