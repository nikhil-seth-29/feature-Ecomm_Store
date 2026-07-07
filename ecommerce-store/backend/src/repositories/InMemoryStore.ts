import { Cart } from "../domain/Cart";
import { Discount } from "../domain/Discount";

/**
 * InMemoryStore — the single source of truth for all runtime state.
 *
 * Design decision: one shared singleton rather than dependency-injected
 * instances per request, which is appropriate for an in-memory store at
 * this scale. See DECISIONS.md for the full trade-off discussion.
 */
export class InMemoryStore {
  carts = new Map<string, Cart>();
  discount = new Discount();
  orderCount = 0;

  stats = {
    totalItemsPurchased: 0,   // sum of quantities across all orders
    totalRevenue: 0,          // gross revenue (pre-discount)
    totalDiscountAmount: 0,   // total discount value given away
    discountCodes: [] as string[],
  };

  /**
   * Resets all state back to a clean slate.
   * Used in tests and can be exposed as an admin endpoint in dev mode.
   */
  reset(): void {
    this.carts.clear();
    this.discount = new Discount();
    this.orderCount = 0;
    this.stats = {
      totalItemsPurchased: 0,
      totalRevenue: 0,
      totalDiscountAmount: 0,
      discountCodes: [],
    };
  }
}

/** Singleton store instance shared across the entire application. */
export const store = new InMemoryStore();
