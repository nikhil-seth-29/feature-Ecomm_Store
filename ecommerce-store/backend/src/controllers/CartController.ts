import { Request, Response } from "express";
import { CartService } from "../services/CartService";

const service = new CartService();

export const addToCart = (req: Request, res: Response): void => {
  try {
    const { userId, itemId, price, quantity } = req.body;
    service.addItem(userId, { itemId, price, quantity });
    res.json({ status: "OK" });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};

export const viewCart = (req: Request, res: Response): void => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }
    const cart = service.getCart(userId);
    if (!cart) {
      res.json({ items: [], total: 0 });
      return;
    }
    res.json({ items: cart.getItems(), total: cart.total() });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
