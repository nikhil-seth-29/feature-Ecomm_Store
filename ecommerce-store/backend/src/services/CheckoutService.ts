import { store } from "../repositories/InMemoryStore";
import { Order } from "../domain/Order";

export class CheckoutService {
  checkout(userId: string, discountCode?: string): Order {
    const cart = store.carts.get(userId);
    if (!cart || cart.isEmpty()) {
      throw new Error("Cart is empty");
    }

    const total = cart.total();
    let discount = 0;

    if (store.discount.canApply(discountCode)) {
      discount = store.discount.apply(total);
      store.stats.totalDiscountAmount += discount;
    }

    const finalAmount = total - discount;

    store.orderCount++;
    store.stats.totalPurchaseAmount += finalAmount;
    store.stats.totalItemsPurchased += cart.getItems().length;

    if (store.orderCount % 3 === 0) {
      const code = `DISCOUNT-${Date.now()}`;
      store.discount.generate(code);
      store.stats.discountCodes.push(code);
    }

    cart.clear();
    return new Order(total, discount, finalAmount);
  }
}
