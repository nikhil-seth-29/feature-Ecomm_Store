import { Router } from "express";
import { stats, generateDiscount } from "../controllers/AdminController";

const router = Router();
router.get("/stats", stats);
router.post("/discount", generateDiscount);
export default router;
