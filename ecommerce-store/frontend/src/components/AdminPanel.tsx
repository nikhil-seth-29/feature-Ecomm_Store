import React, { useEffect, useState } from "react";
import { fetchAdminStats } from "../api.ts";

const AdminPanel = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch(err => {
        console.error("Admin stats error", err);
      });
  }, []);

  if (!stats) {
    return <p style={{ marginTop: 40 }}>Loading admin stats...</p>;
  }

  return (
    <div style={{
      marginTop: 40,
      padding: 20,
      borderTop: "2px solid #eee"
    }}>
      <h3>🛠 Admin Dashboard</h3>

      <p>Total Items Purchased: {stats.totalItemsPurchased}</p>
      <p>Total Purchase Amount: ₹{stats.totalPurchaseAmount}</p>
      <p>Total Discount Given: ₹{stats.totalDiscountAmount}</p>

      <p><strong>Discount Codes:</strong></p>
      <ul>
        {stats.discountCodes.map((c: string) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
