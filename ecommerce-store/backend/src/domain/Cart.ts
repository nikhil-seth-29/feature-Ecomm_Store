export interface CartItem {
  itemId: string;
  price: number;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];

  addItem(item: CartItem): void {
    this.items.push(item);
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  total(): number {
    return this.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );
  }

  clear(): void {
    this.items = [];
  }
}
