/**
 * Order value object.
 *
 * Immutable record of a completed checkout.
 * Carries all amounts so callers never have to recompute.
 */
export class Order {
  constructor(
    /** Gross total before any discount. */
    public readonly total: number,
    /** Discount amount applied (0 if none). */
    public readonly discount: number,
    /** Amount actually charged = total − discount. */
    public readonly finalAmount: number,
    /** The discount code that was redeemed, if any. */
    public readonly appliedCode: string | null = null,
    /** Whether this order triggered a new discount code generation. */
    public readonly newDiscountGenerated: boolean = false,
  ) {}
}
