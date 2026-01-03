import { Cart } from "../domain/Cart";
import { Discount } from "../domain/Discount";

export class InMemoryStore {
  carts = new Map<string, Cart>();
  discount = new Discount();
  orderCount = 0;

  stats = {
    totalItemsPurchased: 0,
    totalPurchaseAmount: 0,
    totalDiscountAmount: 0,
    discountCodes: [] as string[]
  };
}

export const store = new InMemoryStore();
