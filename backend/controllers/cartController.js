import userModel from "../models/userModel.js"
import foodModel from "../models/foodModel.js"
import mongoose from "mongoose"

const readCart = (user) => {
    const cartData = Object.fromEntries(user.cartData || []);
    return Object.keys(cartData).length ? cartData : user.cadData || {};
};

const saveCart = async (user, cartData) => {
    user.cartData = cartData;
    user.cadData = {};
    user.markModified("cadData");
    await user.save();
};

// add items to user cart

const addToCart = async (req, res) => {

    try {
        const { itemId } = req.body;
        if (!mongoose.isValidObjectId(itemId)) return res.status(400).json({ success: false, message: "Valid food item is required" });
        if (!await foodModel.exists({ _id: itemId })) return res.status(404).json({ success: false, message: "Food item not found" });
        const userData = await userModel.findById(req.user.id);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });
        const cartData = readCart(userData);
        const quantity = Number(cartData[itemId] || 0);
        if (!Number.isInteger(quantity) || quantity < 0 || quantity >= 99) {
            return res.status(400).json({ success: false, message: "Cart item limit reached" });
        }
        cartData[itemId] = quantity + 1;
        await saveCart(userData, cartData);
        res.json({ success: true, message: "Added to cart", cartData })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to update cart" })
    }
}

//remove items from user cart

const removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!mongoose.isValidObjectId(itemId)) return res.status(400).json({ success: false, message: "Valid food item is required" });
        const userData = await userModel.findById(req.user.id);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });
        const cartData = readCart(userData);
        const quantity = Number(cartData[itemId] || 0);
        if (quantity <= 1) delete cartData[itemId];
        else cartData[itemId] = quantity - 1;
        await saveCart(userData, cartData);
        res.json({ success: true, message: "Removed from cart", cartData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Unable to update cart" })
    }

}

//fetch user cart data

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user.id);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });
        const cartData = readCart(userData);
        res.json({ success: true, cartData, cadData: cartData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Unable to load cart" })
    }
}

const syncCart = async (req, res) => {
    const requestedCart = req.body.cartData;
    if (!requestedCart || typeof requestedCart !== "object" || Array.isArray(requestedCart)) {
        return res.status(400).json({ success: false, message: "Cart data must be an object" });
    }
    const entries = Object.entries(requestedCart);
    if (entries.length > 100 || entries.some(([id, quantity]) =>
        !mongoose.isValidObjectId(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99
    )) {
        return res.status(400).json({ success: false, message: "Cart contains invalid items or quantities" });
    }
    try {
        const foodIds = entries.map(([id]) => id);
        const foods = await foodModel.find({ _id: { $in: foodIds } }, "_id");
        if (foods.length !== entries.length) {
            return res.status(400).json({ success: false, message: "One or more cart items are no longer available" });
        }
        const userData = await userModel.findById(req.user.id);
        if (!userData) return res.status(404).json({ success: false, message: "User not found" });
        await saveCart(userData, Object.fromEntries(entries));
        res.json({ success: true, cartData: Object.fromEntries(entries) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Unable to sync cart" });
    }
};

export {
    addToCart,
    removeFromCart,
    getCart,
    syncCart
}