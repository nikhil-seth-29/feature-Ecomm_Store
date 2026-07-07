import { STORE_CONFIG } from "../config/storeConfig";

export class Discount {
  private code: string | null = null;
  private used = false;

  generate(code: string): void {
    this.code = code;
    this.used = false;
  }

  canApply(input?: string): boolean {
    return Boolean(input && input === this.code && !this.used);
  }

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
