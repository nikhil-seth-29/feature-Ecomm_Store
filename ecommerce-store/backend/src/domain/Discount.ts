import { STORE_CONFIG } from "../config/storeConfig";

/**
 * Discount domain object.
 *
 * Responsibilities:
 *  - Hold the currently active discount code (one at a time).
 *  - Determine whether a supplied code is valid and unused.
 *  - Calculate the discount amount and mark the code as consumed.
 *
 * Invariants enforced:
 *  - A code can only be applied once (single-use).
 *  - Applying an already-used or non-matching code returns 0.
 */
export class Discount {
  private code: string | null = null;
  private used = false;

  /** Activate a new discount code, resetting used state. */
  generate(code: string): void {
    this.code = code;
    this.used = false;
  }

  /**
   * Returns true only when:
   *  1. A code has been generated,
   *  2. The supplied input matches it exactly, and
   *  3. It has not yet been used.
   */
  canApply(input?: string): boolean {
    return Boolean(input && input === this.code && !this.used);
  }

  /**
   * Applies the discount to `total` and marks the code consumed.
   * Returns the discount AMOUNT (not the final price).
   */
  apply(total: number): number {
    if (!this.code || this.used) {
      return 0;
    }
    this.used = true;
    return Math.round((total * STORE_CONFIG.DISCOUNT_PERCENTAGE) / 100 * 100) / 100;
  }

  getCode(): string | null {
    return this.code;
  }

  isUsed(): boolean {
    return this.used;
  }
}
