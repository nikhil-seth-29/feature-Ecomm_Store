import { AdminService } from "../services/AdminService";

const service = new AdminService();

export const stats = (_, res) => {
  res.json(service.getStats());
};

export const generateDiscount = (_, res) => {
  res.json({ code: service.generateDiscount() });
};
