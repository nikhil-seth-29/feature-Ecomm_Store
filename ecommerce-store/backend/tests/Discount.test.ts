import { Discount } from "../src/domain/Discount";
import { STORE_CONFIG } from "../src/config/storeConfig";

describe("Discount domain", () => {
  let discount: Discount;

  beforeEach(() => {
    discount = new Discount();
  });

  describe("initial state", () => {
    it("has no code on creation", () => {
      expect(discount.getCode()).toBeNull();
    });

    it("cannot be applied before any code is generated", () => {
      expect(discount.canApply("ANY-CODE")).toBe(false);
    });

    it("apply() returns 0 when no code exists", () => {
      expect(discount.apply(500)).toBe(0);
    });
  });

  describe("generate()", () => {
    it("sets the active code", () => {
      discount.generate("CODE-1");
      expect(discount.getCode()).toBe("CODE-1");
    });

    it("reactivates when a new code is generated after the previous was used", () => {
      discount.generate("CODE-1");
      discount.apply(100);
      expect(discount.isUsed()).toBe(true);
      discount.generate("CODE-2");
      expect(discount.isUsed()).toBe(false);
      expect(discount.canApply("CODE-2")).toBe(true);
    });
  });

  describe("canApply()", () => {
    beforeEach(() => discount.generate("VALID-CODE"));

    it("returns true for the correct, unused code", () => {
      expect(discount.canApply("VALID-CODE")).toBe(true);
    });

    it("returns false for a wrong code", () => {
      expect(discount.canApply("WRONG-CODE")).toBe(false);
    });

    it("returns false for undefined input", () => {
      expect(discount.canApply(undefined)).toBe(false);
    });

    it("returns false for an empty string", () => {
      expect(discount.canApply("")).toBe(false);
    });

    it("is case-sensitive", () => {
      expect(discount.canApply("valid-code")).toBe(false);
    });

    it("returns false after the code has been used", () => {
      discount.apply(100);
      expect(discount.canApply("VALID-CODE")).toBe(false);
    });
  });

  describe("apply()", () => {
    beforeEach(() => discount.generate("VALID-CODE"));

    it(`applies ${STORE_CONFIG.DISCOUNT_PERCENTAGE}% of the total`, () => {
      const amount = discount.apply(200);
      expect(amount).toBe((200 * STORE_CONFIG.DISCOUNT_PERCENTAGE) / 100);
    });

    it("marks the code as used after first apply", () => {
      discount.apply(100);
      expect(discount.isUsed()).toBe(true);
    });

    it("returns 0 on a second apply (single-use enforcement)", () => {
      discount.apply(100);
      expect(discount.apply(100)).toBe(0);
    });

    it("handles fractional totals without floating-point drift", () => {
      const amount = discount.apply(99.99);
      expect(amount).toBe(10);
    });
  });
});
