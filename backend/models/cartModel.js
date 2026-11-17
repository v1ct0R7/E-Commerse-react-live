import pool from "../config/database.js";

// kthen shporten si objekt { foodId: sasia } - njesoj si me pare ne frontend
const getCart = async (userId) => {
    const [rows] = await pool.query("SELECT food_id, quantity FROM cart_items WHERE user_id = ?", [userId]);
    const cartData = {};
    rows.forEach((row) => {
        cartData[row.food_id] = row.quantity;
    });
    return cartData;
};

const getQuantity = async (userId, foodId) => {
    const [rows] = await pool.query(
        "SELECT quantity FROM cart_items WHERE user_id = ? AND food_id = ?",
        [userId, foodId]
    );
    return rows[0]?.quantity || 0;
};

const setQuantity = async (userId, foodId, quantity) => {
    if (quantity <= 0) {
        await pool.query("DELETE FROM cart_items WHERE user_id = ? AND food_id = ?", [userId, foodId]);
        return;
    }
    await pool.query(
        "INSERT INTO cart_items (user_id, food_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity)",
        [userId, foodId, quantity]
    );
};

// zevendeson gjithe shporten (perdoret kur bashkojme shporten e vizitorit pas login)
const replaceCart = async (userId, cartData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
        const rows = Object.entries(cartData).map(([foodId, quantity]) => [userId, Number(foodId), quantity]);
        if (rows.length) {
            await connection.query("INSERT INTO cart_items (user_id, food_id, quantity) VALUES ?", [rows]);
        }
        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const clearCart = async (userId) => {
    await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
};

const cartModel = { getCart, getQuantity, setQuantity, replaceCart, clearCart };
export default cartModel;
