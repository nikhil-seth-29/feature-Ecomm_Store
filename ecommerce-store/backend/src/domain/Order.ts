export class Order {
  constructor(
    public readonly total: number,
    public readonly discount: number,
    public readonly finalAmount: number
  ) {}
}
