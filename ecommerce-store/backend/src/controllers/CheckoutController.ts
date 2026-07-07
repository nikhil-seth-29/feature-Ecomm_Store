import { Request, Response } from "express";
import { CheckoutService } from "../services/CheckoutService";

const service = new CheckoutService();

export const checkout = (req: Request, res: Response): void => {
  try {
    const { userId, discountCode } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }
    const order = service.checkout(userId, discountCode);
    res.json(order);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
