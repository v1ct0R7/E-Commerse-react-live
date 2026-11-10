import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import mongoose from "mongoose";
import { calculateDiscountedAmount, calculateOrderAmount, CheckoutInputError, DELIVERY_FEE, getOrderQuantities, priceOrderItems } from "../utils/checkout.js";
import settingsModel from "../models/settingsModel.js";
import { findActiveCoupon } from "./couponController.js";
import validator from "validator";

const getStripe = () => process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

const placeOrder = async (req, res) => {
    const stripe = getStripe();
    if (!stripe) return res.status(503).json({ success: false, message: "Online payments are not configured" });

    const { items } = req.body;
    const submittedAddress = req.body.address;
    const addressFields = ["firstName", "lastname", "email", "street", "city", "state", "zipcode", "country", "phone"];
    if (!submittedAddress ||
        !addressFields.every((field) => typeof submittedAddress[field] === "string" && submittedAddress[field].trim() && submittedAddress[field].trim().length <= 200) ||
        !validator.isEmail(submittedAddress.email.trim())) {
        return res.status(400).json({ success: false, message: "A complete delivery address and cart are required" });
    }
    const address = Object.fromEntries(addressFields.map((field) => [field, submittedAddress[field].trim()]));

    try {
        const quantities = getOrderQuantities(items);
        const foods = await foodModel.find({ _id: { $in: [...quantities.keys()] } });
        const orderItems = priceOrderItems(quantities, foods);
        const settings = await settingsModel.findById("store");
        const deliveryFee = settings?.deliveryFee ?? DELIVERY_FEE;
        const subtotal = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
        const totalBeforeDiscount = calculateOrderAmount(orderItems, deliveryFee);
        const couponCode = typeof req.body.couponCode === "string" ? req.body.couponCode.trim().toUpperCase() : "";
        const coupon = couponCode ? await findActiveCoupon(couponCode) : null;
        if (couponCode && !coupon) {
            return res.status(400).json({ success: false, message: "Coupon is invalid or expired" });
        }
        const { amount, discount } = calculateDiscountedAmount(totalBeforeDiscount, coupon?.discountPercent || 0);
        const order = await orderModel.create({
            userId: req.user.id,
            items: orderItems,
            amount,
            subtotal,
            deliveryFee,
            discount,
            couponCode: coupon?.code || null,
            address,
        });

        let stripeSessionId;
        try {
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            const checkoutSession = {
                line_items: orderItems.map((item) => ({
                    price_data: {
                        currency: "eur",
                        product_data: { name: item.name },
                        unit_amount: Math.round(item.price * 100),
                    },
                    quantity: item.quantity,
                })).concat([{
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Delivery" },
                        unit_amount: Math.round(deliveryFee * 100),
                    },
                    quantity: 1,
                }]),
                mode: "payment",
                success_url: `${frontendUrl}/verify?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${frontendUrl}/verify?session_id={CHECKOUT_SESSION_ID}&cancelled=true`,
                metadata: { orderId: order._id.toString(), userId: req.user.id, couponCode: coupon?.code || "" },
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
            order.stripeSessionId = session.id;
            await order.save();
            await userModel.findByIdAndUpdate(req.user.id, { cartData: {}, cadData: {} });
            return res.status(201).json({ success: true, session_url: session.url });
        } catch (error) {
            if (stripeSessionId) {
                try {
                    await stripe.checkout.sessions.expire(stripeSessionId);
                } catch (expireError) {
                    console.error("Unable to expire failed checkout session:", expireError);
                }
            }
            await orderModel.findByIdAndDelete(order._id);
            throw error;
        }
    } catch (error) {
        if (error instanceof CheckoutInputError) {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to create checkout session" });
    }
};

const verifyOrder = async (req, res) => {
    const stripe = getStripe();
    const { sessionId } = req.body;
    if (!stripe) return res.status(503).json({ success: false, message: "Online payments are not configured" });
    if (typeof sessionId !== "string" || !sessionId) {
        return res.status(400).json({ success: false, message: "Payment session is required" });
    }

    try {
        const order = await orderModel.findOne({ stripeSessionId: sessionId });
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        let session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.metadata?.orderId !== order._id.toString() ||
            session.metadata?.userId !== order.userId ||
            session.currency !== "eur") {
            return res.status(400).json({ success: false, message: "Payment session does not match the order" });
        }

        if (session.payment_status === "paid" && session.amount_total === Math.round(order.amount * 100)) {
            order.payment = true;
            order.status = "Food Processing";
            await order.save();
            return res.json({ success: true, message: "Payment confirmed" });
        }

        if (req.body.cancelled === true && session.status === "open") {
            session = await stripe.checkout.sessions.expire(sessionId);
        }
        if (session.status === "expired") {
            await orderModel.findByIdAndDelete(order._id);
        }
        return res.json({ success: false, message: "Payment was not completed" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Unable to verify payment" });
    }
};

const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.user.id }).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to load orders" });
    }
};

const updateStatus = async (req, res) => {
    const allowedStatuses = ["Food Processing", "Out for delivery", "Delivered"];
    if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    if (!mongoose.isValidObjectId(req.body.orderId)) {
        return res.status(400).json({ success: false, message: "Valid order id is required" });
    }
    try {
        const existingOrder = await orderModel.findById(req.body.orderId);
        if (!existingOrder) return res.status(404).json({ success: false, message: "Order not found" });
        if (!existingOrder.payment) {
            return res.status(409).json({ success: false, message: "Unpaid orders cannot be fulfilled" });
        }
        const order = await orderModel.findByIdAndUpdate(
            req.body.orderId,
            { status: req.body.status },
            { new: true, runValidators: true }
        );
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order status updated", data: order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update order status" });
    }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
