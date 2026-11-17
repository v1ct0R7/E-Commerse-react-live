import pool from "../config/database.js";

const fields = "id AS _id, code, discount_percent AS discountPercent, expires_at AS expiresAt, active, created_at AS createdAt";

const toCoupon = (row) => row ? { ...row, active: Boolean(row.active) } : null;

const findActiveByCode = async (code) => {
    const [rows] = await pool.query(
        `SELECT ${fields} FROM coupons WHERE code = ? AND active = 1 AND (expires_at IS NULL OR expires_at > NOW())`,
        [code]
    );
    return toCoupon(rows[0]);
};

const findAll = async () => {
    const [rows] = await pool.query(`SELECT ${fields} FROM coupons ORDER BY created_at DESC, id DESC`);
    return rows.map(toCoupon);
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT ${fields} FROM coupons WHERE id = ?`, [id]);
    return toCoupon(rows[0]);
};

const create = async ({ code, discountPercent, expiresAt }) => {
    const [result] = await pool.query(
        "INSERT INTO coupons (code, discount_percent, expires_at) VALUES (?, ?, ?)",
        [code, discountPercent, expiresAt]
    );
    return findById(result.insertId);
};

// kthen true nese kuponi u fshi
const remove = async (id) => {
    const [result] = await pool.query("DELETE FROM coupons WHERE id = ?", [id]);
    return result.affectedRows > 0;
};

const couponModel = { findActiveByCode, findAll, findById, create, remove };
export default couponModel;
