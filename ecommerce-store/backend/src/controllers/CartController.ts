import { CartService } from "../services/CartService";

const service = new CartService();

export const addToCart = (req, res) => {
  service.addItem(req.body.userId, req.body);
  res.json({ status: "OK" });
};
