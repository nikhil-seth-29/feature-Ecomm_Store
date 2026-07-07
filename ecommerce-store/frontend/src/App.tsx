import React, { useState, useRef } from "react";
import { addToCart, checkout } from "./api.ts";
import AdminPanel from "./components/AdminPanel.tsx";
import { AdminPanelHandle } from "./components/AdminPanel.tsx";

function App() {
  const USER_ID = "u1";

  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [orders, setOrders] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "info" | "warning">("info");
  const [loading, setLoading] = useState(false);
  const adminPanelRef = useRef<AdminPanelHandle>(null);

  const handleAddItem = async () => {
    await addToCart({
      userId: USER_ID,
      itemId: `item-${Date.now()}`,
      price: 100,
      quantity: 1,
    });
    setCartTotal(prev => prev + 100);
    setCartCount(prev => prev + 1);
    setMessage("Item added to cart ($100)");
    setMessageType("info");
  };

  const handleCheckout = async () => {
    if (cartCount === 0) return;
    setLoading(true);
    try {
      const res = await checkout({
        userId: USER_ID,
        discountCode: discountCode || undefined,
      });

      setResult(res);
      setCartTotal(0);
      setCartCount(0);
      setDiscountCode("");
      setOrders(prev => prev + 1);

      if (res.newDiscountGenerated) {
        setMessage("Discount code generated! Check admin panel.");
        setMessageType("success");
      } else if (res.discount > 0) {
        setMessage(`Order placed! Discount applied: $${res.discount}`);
        setMessageType("success");
      } else {
        setMessage("Order placed successfully.");
        setMessageType("info");
      }

      adminPanelRef.current?.refresh();
    } catch (err) {
      setMessage("Checkout failed.");
      setMessageType("warning");
    } finally {
      setLoading(false);
    }
  };

  const msgColors: Record<string, string> = {
    success: "#d4edda",
    info: "#d1ecf1",
    warning: "#fff3cd",
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 560, margin: "auto" }}>
      <div style={{
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
      }}>
        <h2 style={{ marginTop: 0 }}>Ecommerce Store</h2>

        <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
          <div><strong>Cart:</strong> {cartCount} item(s) &mdash; ${cartTotal}</div>
          <div><strong>Orders placed:</strong> {orders}</div>
        </div>

        <button
          onClick={handleAddItem}
          style={{ padding: "8px 16px", cursor: "pointer", borderRadius: 4, border: "1px solid #aaa" }}
        >
          + Add Item ($100)
        </button>

        <br /><br />

        <input
          placeholder="Discount code (optional)"
          value={discountCode}
          onChange={e => setDiscountCode(e.target.value)}
          style={{ width: "100%", padding: 8, boxSizing: "border-box", borderRadius: 4, border: "1px solid #ccc" }}
        />

        <br /><br />

        <button
          onClick={handleCheckout}
          disabled={cartCount === 0 || loading}
          style={{
            width: "100%",
            padding: 12,
            background: cartCount === 0 ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: 15,
            cursor: cartCount === 0 ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Checkout"}
        </button>

        {message && (
          <p style={{ marginTop: 12, padding: "8px 12px", background: msgColors[messageType], borderRadius: 4 }}>
            {message}
          </p>
        )}

        {result && (
          <div style={{ marginTop: 12 }}>
            <strong>Last order:</strong>
            <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 4, fontSize: 13 }}>
{JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <AdminPanel ref={adminPanelRef} />
    </div>
  );
}

export default App;
