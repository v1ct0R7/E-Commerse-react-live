import pool from "../config/database.js";

const getSettings = async () => {
    // nese rreshti mungon e krijojme me vlerat e parazgjedhura
    await pool.query("INSERT IGNORE INTO settings (id, delivery_fee, currency) VALUES ('store', 2.00, 'eur')");
    const [rows] = await pool.query("SELECT delivery_fee AS deliveryFee, currency FROM settings WHERE id = 'store'");
    return rows[0];
};

const updateDeliveryFee = async (deliveryFee) => {
    await pool.query(
        "INSERT INTO settings (id, delivery_fee, currency) VALUES ('store', ?, 'eur') ON DUPLICATE KEY UPDATE delivery_fee = VALUES(delivery_fee)",
        [deliveryFee]
    );
    return getSettings();
};

const settingsModel = { getSettings, updateDeliveryFee };
export default settingsModel;
