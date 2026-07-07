import { store } from "../repositories/InMemoryStore";
import { Order } from "../domain/Order";
import { STORE_CONFIG } from "../config/storeConfig";

/**
 * CheckoutService — orchestrates the checkout flow.
 *
 * Responsibilities:
 *  1. Validate the cart is non-empty.
 *  2. Optionally apply a discount code.
 *  3. Record the order and update statistics.
 *  4. Generate a new discount code if this is the Nth order.
 *  5. Clear the cart.
 *
 * All business rules (N, discount %) come from STORE_CONFIG —
 * nothing is hardcoded in this service.
 */
export class CheckoutService {
  checkout(userId: string, discountCode?: string): Order {
    const cart = store.carts.get(userId);

    if (!cart || cart.isEmpty()) {
      throw new Error("Cart is empty");
    }

    const total = cart.total();
    let discount = 0;
    let appliedCode: string | null = null;

    // Apply discount if a valid, unused code was supplied
    if (discountCode && store.discount.canApply(discountCode)) {
      discount = store.discount.apply(total);
      appliedCode = discountCode;
      store.stats.totalDiscountAmount += discount;
    }

    const finalAmount = total - discount;

    // Update order count BEFORE checking for Nth order
    store.orderCount++;

    // Update stats: use quantity sum, not line-item count
    store.stats.totalItemsPurchased += cart.totalQuantity();

    // Revenue tracks gross (pre-discount) amounts
    store.stats.totalRevenue += total;

    // Generate a new discount code on every Nth order
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
