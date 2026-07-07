import { AdminService } from "../src/services/AdminService";
import { CartService } from "../src/services/CartService";
import { CheckoutService } from "../src/services/CheckoutService";
import { store } from "../src/repositories/InMemoryStore";
import { STORE_CONFIG } from "../src/config/storeConfig";

beforeEach(() => store.reset());

const cart = new CartService();
const checkout = new CheckoutService();
const admin = new AdminService();

function placeOrder(userId = "u1", price = 100, qty = 1, code?: string) {
  cart.addItem(userId, { itemId: "item", price, quantity: qty });
  return checkout.checkout(userId, code);
}

describe("AdminService - getStats()", () => {
  it("returns zeroed stats on a fresh store", () => {
    const s = admin.getStats();
    expect(s.totalOrders).toBe(0);
    expect(s.totalRevenue).toBe(0);
    expect(s.totalItemsPurchased).toBe(0);
    expect(s.totalDiscountAmount).toBe(0);
    expect(s.discountCodes).toEqual([]);
    expect(s.activeDiscountCode).toBeNull();
  });

  it("reflects correct order count after purchases", () => {
    placeOrder(); placeOrder(); placeOrder();
    expect(admin.getStats().totalOrders).toBe(3);
  });

  it("reflects correct revenue after purchases", () => {
    placeOrder("u1", 150, 2);
    placeOrder("u1", 50, 1);
    expect(admin.getStats().totalRevenue).toBe(350);
  });

  it("shows the active discount code after Nth order", () => {
    for (let i = 0; i < STORE_CONFIG.NTH_ORDER; i++) placeOrder();
    const s = admin.getStats();
    expect(s.activeDiscountCode).toBeTruthy();
    expect(s.activeCodeUsed).toBe(false);
  });

  it("shows activeCodeUsed=true after the code is redeemed", () => {
    for (let i = 0; i < STORE_CONFIG.NTH_ORDER; i++) placeOrder();
    const code = store.discount.getCode()!;
    placeOrder("u1", 100, 1, code);
    expect(admin.getStats().activeCodeUsed).toBe(true);
  });

  it("computes netRevenue = totalRevenue - totalDiscountAmount", () => {
    for (let i = 0; i < STORE_CONFIG.NTH_ORDER; i++) placeOrder("u1", 100);
    const code = store.discount.getCode()!;
    placeOrder("u1", 100, 1, code);
    const s = admin.getStats();
    expect(s.netRevenue).toBe(s.totalRevenue - s.totalDiscountAmount);
    expect(s.netRevenue).toBe(390);
  });
});

describe("AdminService - generateDiscount()", () => {
  it("returns a code with the expected prefix", () => {
    expect(admin.generateDiscount()).toMatch(/^DISCOUNT-\d+$/);
  });

  it("the generated code is immediately usable at checkout", () => {
    const code = admin.generateDiscount();
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const order = checkout.checkout("u1", code);
    expect(order.discount).toBe(10);
  });

  it("adds the code to discountCodes list in stats", () => {
    admin.generateDiscount();
    expect(admin.getStats().discountCodes).toHaveLength(1);
  });

  it("overwrites the previous active code", () => {
    const first = admin.generateDiscount();
    const second = admin.generateDiscount();
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const o1 = checkout.checkout("u1", first);
    expect(o1.discount).toBe(0);
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const o2 = checkout.checkout("u1", second);
    expect(o2.discount).toBe(10);
  });
});

describe("AdminService - resetStore()", () => {
  it("zeroes all stats and state", () => {
    placeOrder(); placeOrder(); placeOrder();
    admin.resetStore();
    const s = admin.getStats();
    expect(s.totalOrders).toBe(0);
    expect(s.totalRevenue).toBe(0);
    expect(s.discountCodes).toHaveLength(0);
    expect(s.activeDiscountCode).toBeNull();
  });
});
