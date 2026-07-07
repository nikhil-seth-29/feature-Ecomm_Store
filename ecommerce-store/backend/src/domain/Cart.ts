/**
 * Cart domain object.
 *
 * Holds line items for a single user session.
 * Does not know about users, discounts, or persistence —
 * that belongs to the service and repository layers.
 */
export interface CartItem {
  itemId: string;
  price: number;    // price per unit
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    // Merge quantity if the same itemId already exists in the cart
    const existing = this.items.find(i => i.itemId === item.itemId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      this.items.push({ ...item });
    }
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  /** Returns a defensive copy so callers cannot mutate internal state. */
  getItems(): CartItem[] {
    return this.items.map(i => ({ ...i }));
  }

  /** Sum of (price × quantity) across all line items. */
  total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  /** Total number of individual units (sum of quantities, not line count). */
  totalQuantity(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }
}
