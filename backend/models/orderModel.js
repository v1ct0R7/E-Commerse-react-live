import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    subtotal: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 2 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    address: { type: Object, required: true },
    status: { type: String, default: "Awaiting payment" },
    date: { type: Date, default: Date.now },
    payment: { type: Boolean, default: false },
    stripeSessionId: { type: String, default: null },
})

const orderModel = mongoose.models.order || mongoose.model("order",orderSchema)
export default orderModel;