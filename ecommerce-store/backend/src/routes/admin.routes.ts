import { Router } from "express";
import { stats, generateDiscount, resetStore } from "../controllers/AdminController";

const router = Router();
router.get("/stats", stats);
router.post("/discount", generateDiscount);
router.post("/reset", resetStore);

export default router;
