export interface CartItem {
  itemId: string;
  price: number;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
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

  getItems(): CartItem[] {
    return this.items.map(i => ({ ...i }));
  }

  total(): number {
    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  totalQuantity(): number {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  clear(): void {
    this.items = [];
  }
}
