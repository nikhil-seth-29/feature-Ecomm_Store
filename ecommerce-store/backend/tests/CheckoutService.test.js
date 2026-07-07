"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CartService_1 = require("../src/services/CartService");
const CheckoutService_1 = require("../src/services/CheckoutService");
test("checkout without discount", () => {
    const cart = new CartService_1.CartService();
    const checkout = new CheckoutService_1.CheckoutService();
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const order = checkout.checkout("u1");
    expect(order.finalAmount).toBe(100);
});
