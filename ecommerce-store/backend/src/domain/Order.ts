export class Order {
  constructor(
    public readonly total: number,
    public readonly discount: number,
    public readonly finalAmount: number,
    public readonly appliedCode: string | null = null,
    public readonly newDiscountGenerated: boolean = false,
  ) {}
}
