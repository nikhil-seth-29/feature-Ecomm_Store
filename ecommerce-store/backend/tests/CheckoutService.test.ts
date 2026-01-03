import { CartService } from "../src/services/CartService";
import { CheckoutService } from "../src/services/CheckoutService";

test("checkout without discount", () => {
  const cart = new CartService();
  const checkout = new CheckoutService();

  cart.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
  const order = checkout.checkout("u1");

  expect(order.finalAmount).toBe(100);
});
