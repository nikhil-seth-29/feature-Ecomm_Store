import React, { useState } from "react";
import { addToCart, checkout } from "./api.ts";
import AdminPanel from "./components/AdminPanel.tsx";

function App() {
  const USER_ID = "u1";
  const NTH_ORDER = 3;

  const [cartTotal, setCartTotal] = useState(0);
  const [orders, setOrders] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");

  const handleAddItem = async () => {
    await addToCart({
      userId: USER_ID,
      itemId: `item-${Date.now()}`,
      price: 100,
      quantity: 1,
    });

    setCartTotal(prev => prev + 100);
    setMessage("🛒 Item added to cart");
  };

  const handleCheckout = async () => {
    const res = await checkout({
      userId: USER_ID,
      discountCode: discountCode || undefined,
    });

    setResult(res);
    setCartTotal(0);
    setDiscountCode("");
    setOrders(prev => prev + 1);

    if ((orders + 1) % NTH_ORDER === 0) {
      setMessage("🎉 Nth order reached! Discount generated!");
    } else {
      setMessage("✅ Order placed successfully");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <div style={{
        maxWidth: 500,
        margin: "auto",
        padding: 20,
        border: "1px solid #ddd",
        borderRadius: 8
      }}>
        <h2>🛍 Ecommerce Store</h2>

        <p><strong>Cart Total:</strong> ₹{cartTotal}</p>
        <p><strong>Orders:</strong> {orders}</p>

        <button onClick={handleAddItem}>
          Add Item (₹100)
        </button>

        <br /><br />

        <input
          placeholder="Discount Code"
          value={discountCode}
          onChange={e => setDiscountCode(e.target.value)}
          style={{ width: "100%", padding: 6 }}
        />

        <br /><br />

        <button
          onClick={handleCheckout}
          disabled={cartTotal === 0}
          style={{
            width: "100%",
            padding: 10,
            background: cartTotal === 0 ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none"
          }}
        >
          Checkout
        </button>

        {message && <p>{message}</p>}

        {result && (
          <pre style={{ background: "#f4f4f4", padding: 10 }}>
{JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      <AdminPanel />
    </div>
  );
}

export default App;
