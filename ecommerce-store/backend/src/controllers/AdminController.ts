import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

const service = new AdminService();

export const stats = (_req: Request, res: Response): void => {
  res.json(service.getStats());
};

export const generateDiscount = (_req: Request, res: Response): void => {
  const code = service.generateDiscount();
  res.status(201).json({ code });
};

export const resetStore = (_req: Request, res: Response): void => {
  service.resetStore();
  res.json({ status: "Store reset successfully" });
};
