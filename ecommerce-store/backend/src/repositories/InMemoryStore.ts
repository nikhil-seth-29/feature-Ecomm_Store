import { Cart } from "../domain/Cart";
import { Discount } from "../domain/Discount";

export class InMemoryStore {
  carts = new Map<string, Cart>();
  discount = new Discount();
  orderCount = 0;

  stats = {
    totalItemsPurchased: 0,
    totalRevenue: 0,
    totalDiscountAmount: 0,
    discountCodes: [] as string[],
  };

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

export const store = new InMemoryStore();
