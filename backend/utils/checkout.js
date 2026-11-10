export const DELIVERY_FEE = 2;

export class CheckoutInputError extends Error {}

export function getOrderQuantities(requestedItems) {
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
        throw new CheckoutInputError("Cart must contain at least one item");
    }

    const quantities = new Map();
    for (const item of requestedItems) {
        const id = item?._id;
        const quantity = Number(item?.quantity);
        if (typeof id !== "string" || !id.trim() || !Number.isInteger(quantity) || quantity < 1) {
            throw new CheckoutInputError("Invalid cart item");
        }
        const nextQuantity = (quantities.get(id) || 0) + quantity;
        if (nextQuantity > 99) throw new CheckoutInputError("Cart item limit reached");
        quantities.set(id, nextQuantity);
    }
    return quantities;
}

export function priceOrderItems(quantities, foods) {
    if (foods.length !== quantities.size) {
        throw new CheckoutInputError("One or more cart items are no longer available");
    }
    return foods.map((food) => {
        const price = Number(food.price);
        if (!Number.isFinite(price) || price <= 0) throw new Error("Food item has an invalid stored price");
        return {
            _id: food._id.toString(),
            name: food.name,
            price,
            quantity: quantities.get(food._id.toString()),
        };
    });
}

export function calculateOrderAmount(items, deliveryFee = DELIVERY_FEE) {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return Math.round((subtotal + deliveryFee) * 100) / 100;
}

export function calculateDiscountedAmount(amount, discountPercent = 0) {
    const subtotalCents = Math.round(amount * 100);
    const discountCents = Math.round(subtotalCents * discountPercent / 100);
    return {
        discount: discountCents / 100,
        amount: (subtotalCents - discountCents) / 100,
    };
}
