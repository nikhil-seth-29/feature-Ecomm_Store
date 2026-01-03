import { CartService } from "../src/services/CartService";
import { CheckoutService } from "../src/services/CheckoutService";
import { store } from "../src/repositories/InMemoryStore";

beforeEach(() => {
  store.carts.clear();
  store.orderCount = 0;
  store.discount = new (store.discount.constructor as any)();
  store.stats.totalDiscountAmount = 0;
});

test("discount is generated on every 3rd order", () => {
  const cart = new CartService();
  const checkout = new CheckoutService();

  for (let i = 1; i <= 3; i++) {
    cart.addItem("u1", { itemId: `i${i}`, price: 100, quantity: 1 });
    checkout.checkout("u1");
  }

  expect(store.discount.getCode()).toBeTruthy();
});

test("discount can only be used once", () => {
  const cart = new CartService();
  const checkout = new CheckoutService();

  // generate discount
  for (let i = 0; i < 3; i++) {
    cart.addItem("u1", { itemId: "i", price: 100, quantity: 1 });
    checkout.checkout("u1");
  }

  const code = store.discount.getCode();

  cart.addItem("u1", { itemId: "i4", price: 100, quantity: 1 });
  const first = checkout.checkout("u1", code!);
  expect(first.discount).toBe(10);

  cart.addItem("u1", { itemId: "i5", price: 100, quantity: 1 });
  const second = checkout.checkout("u1", code!);
  expect(second.discount).toBe(0);
});

test("invalid discount code does not apply", () => {
  const cart = new CartService();
  const checkout = new CheckoutService();

  cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
  const order = checkout.checkout("u1", "INVALID");

  expect(order.discount).toBe(0);
});
