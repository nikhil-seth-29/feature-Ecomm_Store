import { Request, Response } from "express";
import { CartService } from "../services/CartService";

const service = new CartService();

export const addToCart = (req: Request, res: Response): void => {
  service.addItem(req.body.userId, req.body);
  res.json({ status: "OK" });
};
