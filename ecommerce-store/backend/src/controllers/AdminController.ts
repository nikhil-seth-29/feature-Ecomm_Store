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

/**
 * POST /admin/reset — dev/test only endpoint to wipe all in-memory state.
 * In production this would be guarded by an admin auth middleware.
 */
export const resetStore = (_req: Request, res: Response): void => {
  service.resetStore();
  res.json({ status: "Store reset successfully" });
};
