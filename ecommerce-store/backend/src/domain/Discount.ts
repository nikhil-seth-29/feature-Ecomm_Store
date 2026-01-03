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
    if (!this.code || this.used) return 0;
    this.used = true;
    return total * 0.1;
  }

  getCode(): string | null {
    return this.code;
  }
}
