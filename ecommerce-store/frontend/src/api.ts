const BASE_URL = `http://${window.location.hostname}:3001`;

export const addToCart = async (data: any) => {
  await fetch(`${BASE_URL}/cart/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const checkout = async (data: any) => {
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
