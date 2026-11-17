import settingsModel from "../models/settingsModel.js";

export const publicSettings = async (req, res) => {
    try {
        const settings = await settingsModel.getSettings();
        res.json({ success: true, data: { deliveryFee: settings.deliveryFee, currency: settings.currency } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load store settings" });
    }
};

export const getSettings = async (req, res) => {
    try {
        const settings = await settingsModel.getSettings();
        res.json({ success: true, data: settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load store settings" });
    }
};

export const updateSettings = async (req, res) => {
    const deliveryFee = Number(req.body.deliveryFee);
    if (req.body.deliveryFee === "" || req.body.deliveryFee === null ||
        !Number.isFinite(deliveryFee) || deliveryFee < 0 || deliveryFee > 100) {
        return res.status(400).json({ success: false, message: "Delivery fee must be between €0 and €100" });
    }
    try {
        const settings = await settingsModel.updateDeliveryFee(Math.round(deliveryFee * 100) / 100);
        res.json({ success: true, data: settings, message: "Store settings updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update store settings" });
    }
};
