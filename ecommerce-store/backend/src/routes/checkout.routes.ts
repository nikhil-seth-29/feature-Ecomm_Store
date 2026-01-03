import { Router } from "express";
import { checkout } from "../controllers/CheckoutController";

export default Router().post("/", checkout);
