import { store } from "../repositories/InMemoryStore";

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

  generateDiscount(): string {
    const code = `DISCOUNT-${Date.now()}`;
    store.discount.generate(code);
    store.stats.discountCodes.push(code);
    return code;
  }

  resetStore(): void {
    store.reset();
  }
}
