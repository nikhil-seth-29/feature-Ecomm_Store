import { store } from "../repositories/InMemoryStore";

/**
 * AdminService — exposes operational visibility and controls.
 *
 * Intentionally separated from the customer-facing services
 * so admin capabilities can be secured independently (e.g., behind
 * an admin-only auth middleware in a production system).
 */
export class AdminService {
  getStats() {
    return {
      totalItemsPurchased: store.stats.totalItemsPurchased,
      totalRevenue: store.stats.totalRevenue,
      totalDiscountAmount: store.stats.totalDiscountAmount,
      netRevenue: store.stats.totalRevenue - store.stats.totalDiscountAmount,
      totalOrders: store.orderCount,
      discountCodes: store.stats.discountCodes,
      activeDiscountCode: store.discount.getCode(),
      activeCodeUsed: store.discount.isUsed(),
    };
  }

  /**
   * Admin-only manual discount generation.
   * Useful for customer-service overrides or testing.
   * Overwrites any existing active (unused) code.
   */
  generateDiscount(): string {
    const code = `DISCOUNT-${Date.now()}`;
    store.discount.generate(code);
    store.stats.discountCodes.push(code);
    return code;
  }

  /** Hard reset — for dev/testing environments only. */
  resetStore(): void {
    store.reset();
  }
}
