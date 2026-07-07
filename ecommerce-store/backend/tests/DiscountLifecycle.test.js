"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CartService_1 = require("../src/services/CartService");
const CheckoutService_1 = require("../src/services/CheckoutService");
const InMemoryStore_1 = require("../src/repositories/InMemoryStore");
beforeEach(() => {
    InMemoryStore_1.store.carts.clear();
    InMemoryStore_1.store.orderCount = 0;
    InMemoryStore_1.store.discount = new InMemoryStore_1.store.discount.constructor();
    InMemoryStore_1.store.stats.totalDiscountAmount = 0;
});
test("discount is generated on every 3rd order", () => {
    const cart = new CartService_1.CartService();
    const checkout = new CheckoutService_1.CheckoutService();
    for (let i = 1; i <= 3; i++) {
        cart.addItem("u1", { itemId: `i${i}`, price: 100, quantity: 1 });
        checkout.checkout("u1");
    }
    expect(InMemoryStore_1.store.discount.getCode()).toBeTruthy();
});
test("discount can only be used once", () => {
    const cart = new CartService_1.CartService();
    const checkout = new CheckoutService_1.CheckoutService();
    // generate discount
    for (let i = 0; i < 3; i++) {
        cart.addItem("u1", { itemId: "i", price: 100, quantity: 1 });
        checkout.checkout("u1");
    }
    const code = InMemoryStore_1.store.discount.getCode();
    cart.addItem("u1", { itemId: "i4", price: 100, quantity: 1 });
    const first = checkout.checkout("u1", code);
    expect(first.discount).toBe(10);
    cart.addItem("u1", { itemId: "i5", price: 100, quantity: 1 });
    const second = checkout.checkout("u1", code);
    expect(second.discount).toBe(0);
});
test("invalid discount code does not apply", () => {
    const cart = new CartService_1.CartService();
    const checkout = new CheckoutService_1.CheckoutService();
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const order = checkout.checkout("u1", "INVALID");
    expect(order.discount).toBe(0);
});
