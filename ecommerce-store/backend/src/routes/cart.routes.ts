import { Router } from "express";
import { addToCart, viewCart } from "../controllers/CartController";

const router = Router();
router.post("/add", addToCart);
router.get("/:userId", viewCart);

export default router;
