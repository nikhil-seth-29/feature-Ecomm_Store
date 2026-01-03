export interface OrderResponse {
  total: number;
  discount: number;
  finalAmount: number;
}

export interface AdminStats {
  totalItemsPurchased: number;
  totalPurchaseAmount: number;
  totalDiscountAmount: number;
  discountCodes: string[];
}
