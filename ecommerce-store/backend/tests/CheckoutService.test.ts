import { CartService } from "../src/services/CartService";
import { CheckoutService } from "../src/services/CheckoutService";
import { store } from "../src/repositories/InMemoryStore";
import { STORE_CONFIG } from "../src/config/storeConfig";

beforeEach(() => store.reset());

const cart = new CartService();
const checkout = new CheckoutService();

function placeOrder(userId = "u1", discountCode?: string) {
  cart.addItem(userId, { itemId: "item", price: 100, quantity: 1 });
  return checkout.checkout(userId, discountCode);
}

function driveNOrders(n = STORE_CONFIG.NTH_ORDER, userId = "u1") {
  for (let i = 0; i < n; i++) placeOrder(userId);
}

describe("CheckoutService - cart validation", () => {
  it("throws when checking out with an empty cart", () => {
    expect(() => checkout.checkout("u1")).toThrow("Cart is empty");
  });

  it("throws when userId has no cart at all", () => {
    expect(() => checkout.checkout("ghost-user")).toThrow("Cart is empty");
  });

  it("clears the cart after a successful checkout", () => {
    placeOrder("u1");
    expect(store.carts.get("u1")!.isEmpty()).toBe(true);
  });
});

describe("CheckoutService - order amounts", () => {
  it("returns correct total, zero discount, correct finalAmount for a plain order", () => {
    cart.addItem("u1", { itemId: "i1", price: 250, quantity: 2 });
    const order = checkout.checkout("u1");
    expect(order.total).toBe(500);
    expect(order.discount).toBe(0);
    expect(order.finalAmount).toBe(500);
  });

  it("finalAmount equals total minus discount when a code is applied", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    cart.addItem("u1", { itemId: "i1", price: 200, quantity: 1 });
    const order = checkout.checkout("u1", code);
    expect(order.discount).toBe(20);
    expect(order.finalAmount).toBe(180);
    expect(order.total).toBe(200);
  });

  it("sets appliedCode on the order when a discount is used", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const order = checkout.checkout("u1", code);
    expect(order.appliedCode).toBe(code);
  });

  it("appliedCode is null when no discount was used", () => {
    const order = placeOrder();
    expect(order.appliedCode).toBeNull();
  });
});

describe("CheckoutService - Nth order discount generation", () => {
  it(`generates a discount code exactly on order #${STORE_CONFIG.NTH_ORDER}`, () => {
    driveNOrders();
    expect(store.discount.getCode()).toBeTruthy();
  });

  it("does NOT generate a code before the Nth order", () => {
    for (let i = 1; i < STORE_CONFIG.NTH_ORDER; i++) placeOrder();
    expect(store.discount.getCode()).toBeNull();
  });

  it("sets newDiscountGenerated=true only on the Nth order", () => {
    const results: boolean[] = [];
    for (let i = 0; i < STORE_CONFIG.NTH_ORDER; i++) {
      results.push(placeOrder().newDiscountGenerated);
    }
    expect(results.slice(0, -1).every(v => v === false)).toBe(true);
    expect(results[results.length - 1]).toBe(true);
  });

  it("generates a second code on the 2xNth order", () => {
    driveNOrders(STORE_CONFIG.NTH_ORDER * 2);
    expect(store.stats.discountCodes).toHaveLength(2);
  });

  it("appends generated codes to admin stats.discountCodes", () => {
    driveNOrders();
    expect(store.stats.discountCodes).toHaveLength(1);
    expect(store.stats.discountCodes[0]).toMatch(/^DISCOUNT-/);
  });
});

describe("CheckoutService - single-use discount enforcement", () => {
  it("applies the discount on first use", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    const order = checkout.checkout("u1", code);
    expect(order.discount).toBe(10);
  });

  it("does NOT apply the same code a second time", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    placeOrder("u1", code);
    const second = placeOrder("u1", code);
    expect(second.discount).toBe(0);
  });

  it("applying an invalid code gives zero discount", () => {
    const order = placeOrder("u1", "FAKE-CODE");
    expect(order.discount).toBe(0);
    expect(order.finalAmount).toBe(order.total);
  });

  it("passing no code gives zero discount even when a code is available", () => {
    driveNOrders();
    const order = placeOrder("u1");
    expect(order.discount).toBe(0);
  });
});

describe("CheckoutService - statistics accuracy", () => {
  it("tracks totalItemsPurchased as sum of quantities, not line count", () => {
    cart.addItem("u1", { itemId: "i1", price: 10, quantity: 3 });
    cart.addItem("u1", { itemId: "i2", price: 20, quantity: 2 });
    checkout.checkout("u1");
    expect(store.stats.totalItemsPurchased).toBe(5);
  });

  it("tracks totalRevenue as gross pre-discount amount", () => {
    driveNOrders();
    expect(store.stats.totalRevenue).toBe(300);
  });

  it("totalRevenue accumulates gross even when discount is applied", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    cart.addItem("u1", { itemId: "i1", price: 200, quantity: 1 });
    checkout.checkout("u1", code);
    expect(store.stats.totalRevenue).toBe(500);
  });

  it("tracks totalDiscountAmount correctly", () => {
    driveNOrders();
    const code = store.discount.getCode()!;
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    checkout.checkout("u1", code);
    expect(store.stats.totalDiscountAmount).toBe(10);
  });

  it("increments orderCount on each checkout", () => {
    placeOrder("u1");
    placeOrder("u1");
    expect(store.orderCount).toBe(2);
  });
});

describe("CheckoutService - multi-user isolation", () => {
  it("each user has their own independent cart", () => {
    cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
    cart.addItem("u2", { itemId: "i1", price: 200, quantity: 1 });
    const o1 = checkout.checkout("u1");
    const o2 = checkout.checkout("u2");
    expect(o1.total).toBe(100);
    expect(o2.total).toBe(200);
  });

  it("order counter is global across all users", () => {
    placeOrder("u1");
    placeOrder("u2");
    placeOrder("u3");
    expect(store.orderCount).toBe(3);
    expect(store.discount.getCode()).toBeTruthy();
  });
});
