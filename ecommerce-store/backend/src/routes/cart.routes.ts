import { Router } from "express";
import { addToCart } from "../controllers/CartController";

export default Router().post("/add", addToCart);
