import React, { useEffect, useState, useImperativeHandle, forwardRef, useCallback } from "react";
import { fetchAdminStats, generateDiscount } from "../api.ts";
import { AdminStats } from "../types.ts";

export interface AdminPanelHandle {
  refresh: () => void;
}

const AdminPanel = forwardRef<AdminPanelHandle>((_, ref) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Admin stats error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useImperativeHandle(ref, () => ({ refresh }));

  useEffect(() => { refresh(); }, [refresh]);

  const handleGenerateDiscount = async () => {
    setGenerating(true);
    try {
      const res = await generateDiscount();
      setLastGenerated(res.code);
      await refresh();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{
      marginTop: 32,
      padding: 24,
      border: "1px solid #ddd",
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
        <button
          onClick={refresh}
          disabled={loading}
          style={{ padding: "4px 12px", cursor: "pointer", borderRadius: 4, border: "1px solid #aaa" }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {!stats ? (
        <p style={{ color: "#888" }}>Loading...</p>
      ) : (
        <div style={{ marginTop: 16 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Total Orders", stats.totalOrders],
                ["Total Items Purchased", stats.totalItemsPurchased],
                ["Gross Revenue", `$${stats.totalRevenue}`],
                ["Total Discounts Given", `$${stats.totalDiscountAmount}`],
                ["Net Revenue", `$${stats.netRevenue}`],
              ].map(([label, value]) => (
                <tr key={label as string} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 0", color: "#555" }}>{label}</td>
                  <td style={{ padding: "6px 0", fontWeight: "bold", textAlign: "right" }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 16 }}>
            <strong>Discount Codes Generated:</strong>
            {stats.discountCodes.length === 0 ? (
              <p style={{ color: "#888", fontSize: 13 }}>None yet.</p>
            ) : (
              <ul style={{ margin: "8px 0", paddingLeft: 20 }}>
                {stats.discountCodes.map((c: string) => (
                  <li key={c} style={{ fontFamily: "monospace", fontSize: 13 }}>{c}</li>
                ))}
              </ul>
            )}
          </div>

          {stats.activeDiscountCode && (
            <div style={{
              marginTop: 8,
              padding: "8px 12px",
              background: stats.activeCodeUsed ? "#f8d7da" : "#d4edda",
              borderRadius: 4,
              fontSize: 13
            }}>
              <strong>Active code:</strong>{" "}
              <code>{stats.activeDiscountCode}</code>{" "}
              &mdash; {stats.activeCodeUsed ? "Already used" : "Available"}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 20, borderTop: "1px solid #eee", paddingTop: 16 }}>
        <button
          onClick={handleGenerateDiscount}
          disabled={generating}
          style={{
            padding: "8px 16px",
            background: "#1976D2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          {generating ? "Generating..." : "Generate Discount Code (Admin)"}
        </button>

        {lastGenerated && (
          <p style={{ marginTop: 8, fontSize: 13 }}>
            Generated: <code style={{ background: "#eee", padding: "2px 6px", borderRadius: 3 }}>{lastGenerated}</code>
          </p>
        )}
      </div>
    </div>
  );
});

AdminPanel.displayName = "AdminPanel";
export default AdminPanel;
