import { CheckoutService } from "../services/CheckoutService";

const service = new CheckoutService();

export const checkout = (req, res) => {
  try {
    const order = service.checkout(
      req.body.userId,
      req.body.discountCode
    );
    res.json(order);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
};
