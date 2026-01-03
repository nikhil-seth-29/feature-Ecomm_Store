import { store } from "../repositories/InMemoryStore";

export class AdminService {
  getStats() {
    return store.stats;
  }

  generateDiscount(): string {
    const code = `DISCOUNT-${Date.now()}`;
    store.discount.generate(code);
    store.stats.discountCodes.push(code);
    return code;
  }
}
