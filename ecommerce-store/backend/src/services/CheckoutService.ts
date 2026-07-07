import { store } from "../repositories/InMemoryStore";
import { Order } from "../domain/Order";
import { STORE_CONFIG } from "../config/storeConfig";

export class CheckoutService {
  checkout(userId: string, discountCode?: string): Order {
    const cart = store.carts.get(userId);

    if (!cart || cart.isEmpty()) {
      throw new Error("Cart is empty");
    }

    const total = cart.total();
    let discount = 0;
    let appliedCode: string | null = null;

    if (discountCode && store.discount.canApply(discountCode)) {
      discount = store.discount.apply(total);
      appliedCode = discountCode;
      store.stats.totalDiscountAmount += discount;
    }

    const finalAmount = total - discount;

    store.orderCount++;
    store.stats.totalItemsPurchased += cart.totalQuantity();
    store.stats.totalRevenue += total;

    let newDiscountGenerated = false;
    if (store.orderCount % STORE_CONFIG.NTH_ORDER === 0) {
      const code = `DISCOUNT-${Date.now()}`;
      store.discount.generate(code);
      store.stats.discountCodes.push(code);
      newDiscountGenerated = true;
    }

    cart.clear();

    return new Order(total, discount, finalAmount, appliedCode, newDiscountGenerated);
  }
}
