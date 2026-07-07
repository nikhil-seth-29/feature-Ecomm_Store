import { CartService } from "../src/services/CartService";
import { store } from "../src/repositories/InMemoryStore";

beforeEach(() => store.reset());

describe("CartService", () => {
  let service: CartService;
  beforeEach(() => { service = new CartService(); });

  describe("addItem() - validation", () => {
    it("throws if userId is missing", () => {
      expect(() =>
        service.addItem("", { itemId: "i1", price: 100, quantity: 1 })
      ).toThrow("userId is required");
    });
    it("throws if itemId is missing", () => {
      expect(() =>
        service.addItem("u1", { itemId: "", price: 100, quantity: 1 })
      ).toThrow("itemId is required");
    });
    it("throws if price is zero", () => {
      expect(() =>
        service.addItem("u1", { itemId: "i1", price: 0, quantity: 1 })
      ).toThrow("price must be a positive number");
    });
    it("throws if price is negative", () => {
      expect(() =>
        service.addItem("u1", { itemId: "i1", price: -10, quantity: 1 })
      ).toThrow("price must be a positive number");
    });
    it("throws if quantity is zero", () => {
      expect(() =>
        service.addItem("u1", { itemId: "i1", price: 100, quantity: 0 })
      ).toThrow("quantity must be a positive integer");
    });
    it("throws if quantity is a float", () => {
      expect(() =>
        service.addItem("u1", { itemId: "i1", price: 100, quantity: 1.5 })
      ).toThrow("quantity must be a positive integer");
    });
  });

  describe("addItem() - happy path", () => {
    it("creates a cart for a new user", () => {
      service.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
      expect(service.getCart("u1")).not.toBeNull();
    });
    it("adds the item to the user cart", () => {
      service.addItem("u1", { itemId: "i1", price: 100, quantity: 2 });
      expect(service.getCart("u1")!.total()).toBe(200);
    });
    it("different users have isolated carts", () => {
      service.addItem("u1", { itemId: "i1", price: 100, quantity: 1 });
      service.addItem("u2", { itemId: "i1", price: 200, quantity: 1 });
      expect(service.getCart("u1")!.total()).toBe(100);
      expect(service.getCart("u2")!.total()).toBe(200);
    });
  });

  describe("getCart()", () => {
    it("returns null for a user with no cart", () => {
      expect(service.getCart("unknown-user")).toBeNull();
    });
  });
});
