import { Cart } from "../src/domain/Cart";

describe("Cart domain", () => {
  let cart: Cart;
  beforeEach(() => { cart = new Cart(); });

  describe("isEmpty()", () => {
    it("is empty on creation", () => { expect(cart.isEmpty()).toBe(true); });
    it("is not empty after adding an item", () => {
      cart.addItem({ itemId: "a", price: 50, quantity: 1 });
      expect(cart.isEmpty()).toBe(false);
    });
    it("is empty again after clear()", () => {
      cart.addItem({ itemId: "a", price: 50, quantity: 1 });
      cart.clear();
      expect(cart.isEmpty()).toBe(true);
    });
  });

  describe("total()", () => {
    it("returns 0 for an empty cart", () => { expect(cart.total()).toBe(0); });
    it("calculates price x quantity for a single item", () => {
      cart.addItem({ itemId: "a", price: 100, quantity: 3 });
      expect(cart.total()).toBe(300);
    });
    it("sums across multiple different items", () => {
      cart.addItem({ itemId: "a", price: 100, quantity: 2 });
      cart.addItem({ itemId: "b", price: 50, quantity: 4 });
      expect(cart.total()).toBe(400);
    });
  });

  describe("totalQuantity()", () => {
    it("returns 0 for an empty cart", () => { expect(cart.totalQuantity()).toBe(0); });
    it("sums quantities across multiple line items", () => {
      cart.addItem({ itemId: "a", price: 10, quantity: 2 });
      cart.addItem({ itemId: "b", price: 20, quantity: 5 });
      expect(cart.totalQuantity()).toBe(7);
    });
  });

  describe("addItem() - quantity merging", () => {
    it("merges quantity when the same itemId is added twice", () => {
      cart.addItem({ itemId: "a", price: 100, quantity: 1 });
      cart.addItem({ itemId: "a", price: 100, quantity: 2 });
      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(3);
      expect(cart.total()).toBe(300);
    });
    it("keeps separate line items for different itemIds", () => {
      cart.addItem({ itemId: "a", price: 100, quantity: 1 });
      cart.addItem({ itemId: "b", price: 200, quantity: 1 });
      expect(cart.getItems()).toHaveLength(2);
    });
  });

  describe("getItems() - immutability", () => {
    it("mutating returned array does not affect cart internal state", () => {
      cart.addItem({ itemId: "a", price: 100, quantity: 1 });
      const items = cart.getItems();
      items[0].price = 9999;
      expect(cart.total()).toBe(100);
    });
  });
});
