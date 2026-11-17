import cartModel from "../models/cartModel.js"
import foodModel from "../models/foodModel.js"
import { isValidId } from "../utils/validation.js"

// add items to user cart

const addToCart = async (req, res) => {
    try {
        const { itemId } = req.body;
        if (!isValidId(itemId)) return res.status(400).json({ success: false, message: "Valid food item is required" });
        if (!await foodModel.findById(itemId)) return res.status(404).json({ success: false, message: "Food item not found" });
        const quantity = await cartModel.getQuantity(req.user.id, itemId);
        if (quantity >= 99) {
            return res.status(400).json({ success: false, message: "Cart item limit reached" });
        }
        await cartModel.setQuantity(req.user.id, itemId, quantity + 1);
        const cartData = await cartModel.getCart(req.user.id);
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
        if (!isValidId(itemId)) return res.status(400).json({ success: false, message: "Valid food item is required" });
        const quantity = await cartModel.getQuantity(req.user.id, itemId);
        await cartModel.setQuantity(req.user.id, itemId, quantity - 1);
        const cartData = await cartModel.getCart(req.user.id);
        res.json({ success: true, message: "Removed from cart", cartData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Unable to update cart" })
    }
}

//fetch user cart data

const getCart = async (req, res) => {
    try {
        const cartData = await cartModel.getCart(req.user.id);
        res.json({ success: true, cartData })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Unable to load cart" })
    }
}

// save the whole cart (used after login to merge the guest cart)

const syncCart = async (req, res) => {
    const requestedCart = req.body.cartData;
    if (!requestedCart || typeof requestedCart !== "object" || Array.isArray(requestedCart)) {
        return res.status(400).json({ success: false, message: "Cart data must be an object" });
    }
    const entries = Object.entries(requestedCart);
    if (entries.length > 100 || entries.some(([id, quantity]) =>
        !isValidId(id) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99
    )) {
        return res.status(400).json({ success: false, message: "Cart contains invalid items or quantities" });
    }
    try {
        // heqim artikujt qe nuk ekzistojne me ne menu (p.sh. i fshiu admini)
        const foods = await foodModel.findByIds(entries.map(([id]) => Number(id)));
        const existingIds = foods.map((food) => String(food._id));
        const cleanCart = Object.fromEntries(entries.filter(([id]) => existingIds.includes(String(Number(id)))));
        await cartModel.replaceCart(req.user.id, cleanCart);
        const cartData = await cartModel.getCart(req.user.id);
        res.json({ success: true, cartData });
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
