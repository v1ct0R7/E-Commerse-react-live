import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import cartModel from "../models/cartModel.js";
import settingsModel from "../models/settingsModel.js";
import Stripe from "stripe";
import validator from "validator";
import { calculateDiscountedAmount, calculateOrderAmount, calculateSubtotal, CheckoutInputError, DELIVERY_FEE, getOrderQuantities, priceOrderItems } from "../utils/checkout.js";
import { findActiveCoupon } from "./couponController.js";
import { isValidId } from "../utils/validation.js";

const getStripe = () => process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const addressFields = ["firstName", "lastname", "email", "street", "city", "state", "zipcode", "country", "phone"];

// placing user order from frontend

const placeOrder = async (req, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ success: false, message: "Online payments are not configured" });

    const { items } = req.body;
    const submittedAddress = req.body.address;
    if (!submittedAddress ||
        !addressFields.every((field) => typeof submittedAddress[field] === "string" && submittedAddress[field].trim() && submittedAddress[field].trim().length <= 200) ||
        !validator.isEmail(submittedAddress.email.trim())) {
        return res.status(400).json({ success: false, message: "A complete delivery address and cart are required" });
    }
    const address = Object.fromEntries(addressFields.map((field) => [field, submittedAddress[field].trim()]));

    let orderId;
    let stripeSessionId;
    try {
        // cmimet merren nga databaza, jo nga frontend-i
        const quantities = getOrderQuantities(items);
        const foods = await foodModel.findByIds([...quantities.keys()]);
        const orderItems = priceOrderItems(quantities, foods);
        const settings = await settingsModel.getSettings();
        const deliveryFee = settings?.deliveryFee ?? DELIVERY_FEE;
        const subtotal = calculateSubtotal(orderItems);
        const totalBeforeDiscount = calculateOrderAmount(orderItems, deliveryFee);
        const couponCode = typeof req.body.couponCode === "string" ? req.body.couponCode.trim().toUpperCase() : "";
        const coupon = couponCode ? await findActiveCoupon(couponCode) : null;
        if (couponCode && !coupon) {
            return res.status(400).json({ success: false, message: "Coupon is invalid or expired" });
        }
        const { amount, discount } = calculateDiscountedAmount(totalBeforeDiscount, coupon?.discountPercent || 0);

        orderId = await orderModel.create({
            userId: req.user.id,
            items: orderItems,
            amount,
            subtotal,
            deliveryFee,
            discount,
            couponCode: coupon?.code || null,
            address,
        });

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const line_items = orderItems.map((item) => ({
            price_data: {
                currency: "eur",
                product_data: { name: item.name },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));
        if (deliveryFee > 0) {
            line_items.push({
                price_data: {
                    currency: "eur",
                    product_data: { name: "Delivery" },
                    unit_amount: Math.round(deliveryFee * 100),
                },
                quantity: 1,
            });
        }
        const checkoutSession = {
            line_items,
            mode: "payment",
            customer_email: address.email,
            success_url: `${frontendUrl}/verify?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/verify?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
            metadata: { orderId: String(orderId), userId: String(req.user.id), couponCode: coupon?.code || "" },
        };
        if (coupon && discount > 0) {
            const stripeCoupon = await stripe.coupons.create({
                amount_off: Math.round(discount * 100),
                currency: "eur",
                duration: "once",
                name: `${coupon.code} discount`,
            });
            checkoutSession.discounts = [{ coupon: stripeCoupon.id }];
        }
        const session = await stripe.checkout.sessions.create(checkoutSession);
        stripeSessionId = session.id;
        await orderModel.setSessionId(orderId, session.id);
        // shporta zbrazet vetem pasi pagesa konfirmohet (te verifyOrder)
        return res.status(201).json({ success: true, session_url: session.url });
    } catch (error) {
        // nese diçka deshtoi, fshijme porosine e papaguar qe mos te mbetet ne databaze
        if (stripeSessionId) {
            await stripe.checkout.sessions.expire(stripeSessionId).catch((expireError) => console.error("Unable to expire failed checkout session:", expireError));
        }
        if (orderId) {
            await orderModel.remove(orderId).catch((removeError) => console.error("Unable to remove failed order:", removeError));
        }
        if (error instanceof CheckoutInputError) {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to create checkout session" });
    }
};

// verify payment after Stripe redirects back to the frontend

const verifyOrder = async (req, res) => {
    const stripe = getStripe();
    const { sessionId } = req.body;
    if (!stripe) return res.status(503).json({ success: false, message: "Online payments are not configured" });
    if (typeof sessionId !== "string" || !sessionId) {
        return res.status(400).json({ success: false, message: "Payment session is required" });
    }

    try {
        const order = await orderModel.findBySessionId(sessionId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        if (order.payment) return res.json({ success: true, message: "Payment confirmed" });

        let session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.metadata?.orderId !== String(order._id) ||
            session.metadata?.userId !== String(order.userId) ||
            session.currency !== "eur") {
            return res.status(400).json({ success: false, message: "Payment session does not match the order" });
        }

        if (session.payment_status === "paid" && session.amount_total === Math.round(order.amount * 100)) {
            await orderModel.markPaid(order._id);
            await cartModel.clearCart(order.userId);
            return res.json({ success: true, message: "Payment confirmed" });
        }

        if (req.body.cancelled === true && session.status === "open") {
            session = await stripe.checkout.sessions.expire(sessionId);
        }
        if (session.status === "expired") {
            await orderModel.remove(order._id);
        }
        return res.json({ success: false, message: "Payment was not completed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to verify payment" });
    }
};

// user orders for frontend

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.findByUser(req.user.id);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

// listing orders for admin panel

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.findAll();
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

// api for updating order status

const updateStatus = async (req, res) => {
    const allowedStatuses = ["Food Processing", "Out for delivery", "Delivered"];
    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    if (!isValidId(req.body.orderId)) {
        return res.status(400).json({ success: false, message: "Valid order id is required" });
    }
    try {
        const existingOrder = await orderModel.findById(req.body.orderId);
        if (!existingOrder) return res.status(404).json({ success: false, message: "Order not found" });
        if (!existingOrder.payment) {
            return res.status(409).json({ success: false, message: "Unpaid orders cannot be fulfilled" });
        }
        const order = await orderModel.updateStatus(req.body.orderId, req.body.status);
        res.json({ success: true, message: "Order status updated", data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
