import pool from "../config/database.js";

const fields = "id AS _id, name, description, price, image, category";

const findAll = async () => {
    const [rows] = await pool.query(`SELECT ${fields} FROM foods ORDER BY id`);
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT ${fields} FROM foods WHERE id = ?`, [id]);
    return rows[0] || null;
};

// merr disa ushqime njeheresh (p.sh. per shporten ose porosine)
const findByIds = async (ids) => {
    if (!ids.length) return [];
    const [rows] = await pool.query(`SELECT ${fields} FROM foods WHERE id IN (?)`, [ids]);
    return rows;
};

const create = async ({ name, description, price, image, category }) => {
    const [result] = await pool.query(
        "INSERT INTO foods (name, description, price, image, category) VALUES (?, ?, ?, ?, ?)",
        [name, description, price, image, category]
    );
    return findById(result.insertId);
};

const remove = async (id) => {
    await pool.query("DELETE FROM foods WHERE id = ?", [id]);
};

const foodModel = { findAll, findById, findByIds, create, remove };
export default foodModel;
