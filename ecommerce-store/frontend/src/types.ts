export interface CartItem {
  itemId: string;
  price: number;
  quantity: number;
}

export interface CartResponse {
  items: CartItem[];
  total: number;
}

export interface OrderResponse {
  total: number;
  discount: number;
  finalAmount: number;
  appliedCode: string | null;
  newDiscountGenerated: boolean;
}

export interface AdminStats {
  totalItemsPurchased: number;
  totalRevenue: number;
  totalDiscountAmount: number;
  netRevenue: number;
  totalOrders: number;
  discountCodes: string[];
  activeDiscountCode: string | null;
  activeCodeUsed: boolean;
}
