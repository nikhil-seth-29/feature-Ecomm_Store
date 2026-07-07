const BASE_URL = `http://${window.location.hostname}:3001`;

export const addToCart = async (data: {
  userId: string;
  itemId: string;
  price: number;
  quantity: number;
}) => {
  const res = await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
};

export const viewCart = async (userId: string) => {
  const res = await fetch(`${BASE_URL}/cart/${userId}`);
  return res.json();
};

export const checkout = async (data: {
  userId: string;
  discountCode?: string;
}) => {
  const res = await fetch(`${BASE_URL}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const fetchAdminStats = async () => {
  const res = await fetch(`${BASE_URL}/admin/stats`);
  return res.json();
};

export const generateDiscount = async (): Promise<{ code: string }> => {
  const res = await fetch(`${BASE_URL}/admin/discount`, { method: "POST" });
  return res.json();
};
