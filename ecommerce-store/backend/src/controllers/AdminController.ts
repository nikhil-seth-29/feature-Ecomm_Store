import { Request, Response } from "express";
import { AdminService } from "../services/AdminService";

const service = new AdminService();

export const stats = (_req: Request, res: Response): void => {
  res.json(service.getStats());
};

export const generateDiscount = (_req: Request, res: Response): void => {
  res.json({ code: service.generateDiscount() });
};
