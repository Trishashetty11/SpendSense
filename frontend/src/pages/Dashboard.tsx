import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  recurring: boolean;
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("name") || "User";
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/api/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonth = expenses.filter(e => {
    const d = new Date(e.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((sum, e) => sum + e.amount, 0);

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const exportCsv = async () => {
    try {
      const res = await api.get("/api/expenses/export/csv", {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Export failed", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAF8", minHeight: "100vh" }}>

      {/* Navbar */}
      <div style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ fontWeight: 700, color: "#00B386", fontSize: "16px" }}>
          💰 SpendSense
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#6B7280" }}>Hi, {name} 👋</span>
          <button onClick={() => navigate("/analytics")} style={{
            fontSize: "12px", color: "#00B386", border: "1px solid #00B386",
            backgroundColor: "#ffffff", padding: "6px 12px",
            borderRadius: "8px", cursor: "pointer", fontWeight: 500
          }}>
            Analytics
          </button>
          <button onClick={() => navigate("/ai-insights")} style={{
            fontSize: "12px", color: "#6366F1", border: "1px solid #6366F1",
            backgroundColor: "#ffffff", padding: "6px 12px",
            borderRadius: "8px", cursor: "pointer", fontWeight: 500
          }}>
            AI Insights
          </button>
          <button onClick={logout} style={{
            fontSize: "12px", color: "#EF4444", border: "1px solid #FEE2E2",
            backgroundColor: "#FEF2F2", padding: "6px 12px",
            borderRadius: "8px", cursor: "pointer", fontWeight: 500
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
          {[
            { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "#1A1A2E" },
            { label: "This Month", value: `₹${thisMonth.toLocaleString()}`, color: "#00B386" },
            { label: "Transactions", value: expenses.length.toString(), color: "#6366F1" },
          ].map((card) => (
            <div key={card.label} style={{
              backgroundColor: "#ffffff", borderRadius: "14px",
              padding: "20px", border: "1px solid #E5E7EB"
            }}>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "8px" }}>{card.label}</div>
              <div style={{ fontSize: "24px", fontWeight: 700, color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: "14px",
          border: "1px solid #E5E7EB", overflow: "hidden"
        }}>
          <div style={{
            padding: "16px 20px", borderBottom: "1px solid #E5E7EB",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <span style={{ fontWeight: 600, fontSize: "14px", color: "#1A1A2E" }}>
              Recent Transactions
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={exportCsv}
                style={{
                  backgroundColor: "#ffffff", color: "#6B7280",
                  border: "1px solid #E5E7EB", borderRadius: "8px",
                  padding: "7px 14px", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer"
                }}>
                ↓ Export CSV
              </button>
              <button
                onClick={() => navigate("/add-expense")}
                style={{
                  backgroundColor: "#00B386", color: "white",
                  border: "none", borderRadius: "8px",
                  padding: "7px 14px", fontSize: "12px",
                  fontWeight: 600, cursor: "pointer"
                }}>
                + Add Expense
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
              Loading...
            </div>
          ) : expenses.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#6B7280", fontSize: "14px" }}>
              No expenses yet. Add your first one!
            </div>
          ) : (
            expenses.slice().reverse().map((expense) => (
              <div key={expense.id} style={{
                padding: "14px 20px",
                borderBottom: "1px solid #F3F4F6",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "10px",
                    backgroundColor: expense.categoryColor + "20",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "16px"
                  }}>
                    {expense.categoryIcon || "💸"}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 500, color: "#1A1A2E" }}>
                      {expense.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>
                      {expense.categoryName} • {new Date(expense.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444" }}>
                  - ₹{Number(expense.amount).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}