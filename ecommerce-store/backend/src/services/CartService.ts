import { store } from "../repositories/InMemoryStore";
import { CartItem, Cart } from "../domain/Cart";

export class CartService {
  addItem(userId: string, item: CartItem): void {
    if (!userId || typeof userId !== "string") {
      throw new Error("userId is required");
    }
    if (!item.itemId || typeof item.itemId !== "string") {
      throw new Error("itemId is required");
    }
    if (typeof item.price !== "number" || item.price <= 0) {
      throw new Error("price must be a positive number");
    }
    if (typeof item.quantity !== "number" || item.quantity < 1 || !Number.isInteger(item.quantity)) {
      throw new Error("quantity must be a positive integer");
    }
    if (!store.carts.has(userId)) {
      store.carts.set(userId, new Cart());
    }
    store.carts.get(userId)!.addItem(item);
  }

  getCart(userId: string): Cart | null {
    return store.carts.get(userId) ?? null;
  }
}
