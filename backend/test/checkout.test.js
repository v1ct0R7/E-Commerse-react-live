import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateOrderAmount,
  calculateDiscountedAmount,
  CheckoutInputError,
  getOrderQuantities,
  priceOrderItems,
} from "../utils/checkout.js";

test("combines duplicate cart lines and prices them from database values", () => {
  const quantities = getOrderQuantities([
    { _id: "food-1", quantity: 2 },
    { _id: "food-1", quantity: 1 },
    { _id: "food-2", quantity: 1 },
  ]);
  const items = priceOrderItems(quantities, [
    { _id: "food-1", name: "Soup", price: 4.5 },
    { _id: "food-2", name: "Bread", price: 2.25 },
  ]);

  assert.deepEqual(items.map(({ name, price, quantity }) => ({ name, price, quantity })), [
    { name: "Soup", price: 4.5, quantity: 3 },
    { name: "Bread", price: 2.25, quantity: 1 },
  ]);
  assert.equal(calculateOrderAmount(items), 17.75);
});

test("rejects empty, invalid, and excessive quantities", () => {
  assert.throws(() => getOrderQuantities([]), CheckoutInputError);
  assert.throws(() => getOrderQuantities([{ _id: "food-1", quantity: 0 }]), CheckoutInputError);
  assert.throws(() => getOrderQuantities([
    { _id: "food-1", quantity: 50 },
    { _id: "food-1", quantity: 50 },
  ]), CheckoutInputError);
});

test("rejects cart items that are no longer in the menu", () => {
  const quantities = getOrderQuantities([{ _id: "food-missing", quantity: 1 }]);
  assert.throws(() => priceOrderItems(quantities, []), /no longer available/);
});

test("rounds checkout totals to cents", () => {
  assert.equal(calculateOrderAmount([{ price: 1.1, quantity: 3 }]), 5.3);
});

test("applies percentage coupons in cents to the full order total", () => {
  assert.deepEqual(calculateDiscountedAmount(12.35, 20), { discount: 2.47, amount: 9.88 });
});
