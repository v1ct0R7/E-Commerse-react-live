import pool from "../config/database.js";

const orderFields = `id AS _id, user_id AS userId, amount, subtotal, delivery_fee AS deliveryFee, discount,
    coupon_code AS couponCode, first_name, last_name, email, street, city, state, zipcode, country, phone,
    status, payment, stripe_session_id AS stripeSessionId, date`;

// i bashkon rreshtat e tabeles orders me artikujt e tyre nga order_items,
// qe frontend-i te marre te njejten forme si me pare: { items: [...], address: {...} }
const attachItems = async (rows) => {
    if (!rows.length) return [];
    const orderIds = rows.map((row) => row._id);
    const [items] = await pool.query(
        "SELECT order_id, food_id AS _id, name, price, quantity FROM order_items WHERE order_id IN (?) ORDER BY id",
        [orderIds]
    );
    return rows.map((row) => ({
        _id: row._id,
        userId: row.userId,
        items: items
            .filter((item) => item.order_id === row._id)
            .map(({ _id, name, price, quantity }) => ({ _id, name, price, quantity })),
        amount: row.amount,
        subtotal: row.subtotal,
        deliveryFee: row.deliveryFee,
        discount: row.discount,
        couponCode: row.couponCode,
        address: {
            firstName: row.first_name,
            lastname: row.last_name,
            email: row.email,
            street: row.street,
            city: row.city,
            state: row.state,
            zipcode: row.zipcode,
            country: row.country,
            phone: row.phone,
        },
        status: row.status,
        payment: Boolean(row.payment),
        stripeSessionId: row.stripeSessionId,
        date: row.date,
    }));
};

const create = async ({ userId, items, amount, subtotal, deliveryFee, discount, couponCode, address }) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const [result] = await connection.query(
            `INSERT INTO orders (user_id, amount, subtotal, delivery_fee, discount, coupon_code,
                first_name, last_name, email, street, city, state, zipcode, country, phone)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, amount, subtotal, deliveryFee, discount, couponCode,
                address.firstName, address.lastname, address.email, address.street, address.city,
                address.state, address.zipcode, address.country, address.phone]
        );
        const orderId = result.insertId;
        const itemRows = items.map((item) => [orderId, item._id, item.name, item.price, item.quantity]);
        await connection.query("INSERT INTO order_items (order_id, food_id, name, price, quantity) VALUES ?", [itemRows]);
        await connection.commit();
        return orderId;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const findById = async (id) => {
    const [rows] = await pool.query(`SELECT ${orderFields} FROM orders WHERE id = ?`, [id]);
    const orders = await attachItems(rows);
    return orders[0] || null;
};

const findBySessionId = async (sessionId) => {
    const [rows] = await pool.query(`SELECT ${orderFields} FROM orders WHERE stripe_session_id = ?`, [sessionId]);
    const orders = await attachItems(rows);
    return orders[0] || null;
};

const findByUser = async (userId) => {
    const [rows] = await pool.query(`SELECT ${orderFields} FROM orders WHERE user_id = ? ORDER BY date DESC, id DESC`, [userId]);
    return attachItems(rows);
};

const findAll = async () => {
    const [rows] = await pool.query(`SELECT ${orderFields} FROM orders ORDER BY date DESC, id DESC`);
    return attachItems(rows);
};

const setSessionId = async (id, sessionId) => {
    await pool.query("UPDATE orders SET stripe_session_id = ? WHERE id = ?", [sessionId, id]);
};

const markPaid = async (id) => {
    await pool.query("UPDATE orders SET payment = 1, status = 'Food Processing' WHERE id = ?", [id]);
};

const updateStatus = async (id, status) => {
    await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    return findById(id);
};

const remove = async (id) => {
    await pool.query("DELETE FROM orders WHERE id = ?", [id]);
};

const orderModel = { create, findById, findBySessionId, findByUser, findAll, setSessionId, markPaid, updateStatus, remove };
export default orderModel;
