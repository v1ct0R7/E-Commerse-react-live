import pool from "../config/database.js";

// kolonat qe i kthejme ne frontend (pa password)
const publicFields = "id AS _id, name, email, role, created_at AS createdAt";

const findByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT ${publicFields} FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
};

const create = async ({ name, email, password }) => {
    const [result] = await pool.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, password]
    );
    return findById(result.insertId);
};

const findAll = async () => {
    const [rows] = await pool.query(`SELECT ${publicFields} FROM users ORDER BY created_at DESC, id DESC`);
    return rows;
};

const userModel = { findByEmail, findById, create, findAll };
export default userModel;
