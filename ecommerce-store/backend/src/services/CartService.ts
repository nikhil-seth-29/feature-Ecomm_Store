import { store } from "../repositories/InMemoryStore";
import { CartItem, Cart } from "../domain/Cart";

export class CartService {
  addItem(userId: string, item: CartItem): void {
    if (!store.carts.has(userId)) {
      store.carts.set(userId, new Cart());
    }
    store.carts.get(userId)!.addItem(item);
  }
}
