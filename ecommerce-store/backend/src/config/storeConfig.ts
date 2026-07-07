/**
 * Centralised store configuration.
 * All business-rule constants live here so nothing is hardcoded
 * deeper in the stack. Change N or the percentage here and
 * the entire system automatically picks it up.
 */
export const STORE_CONFIG = {
  /** Every Nth order triggers a discount-code generation. */
  NTH_ORDER: 3,
  /** Percentage discount applied when a valid code is redeemed. */
  DISCOUNT_PERCENTAGE: 10,
} as const;
