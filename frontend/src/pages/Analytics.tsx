import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../api";

interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryColor: string;
}

export default function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/expenses").then((res) => {
      setExpenses(res.data);
      setLoading(false);
    });
  }, []);

  // Category wise data for pie chart — sorted by value so colors match correctly
  const categoryData = expenses.reduce((acc: any[], expense) => {
    const existing = acc.find((item) => item.name === expense.categoryName);
    if (existing) {
      existing.value += Number(expense.amount);
    } else {
      acc.push({
        name: expense.categoryName || "Other",
        value: Number(expense.amount),
        color: expense.categoryColor || "#9CA3AF"
      });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.value - a.value);

  // Monthly data for bar chart
  const monthlyData = expenses.reduce((acc: any[], expense) => {
    const month = new Date(expense.date).toLocaleString("en-IN", { month: "short" });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.amount += Number(expense.amount);
    } else {
      acc.push({ month, amount: Number(expense.amount) });
    }
    return acc;
  }, []);

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div style={{ backgroundColor: "#F8FAF8", minHeight: "100vh" }}>

      {/* Navbar */}
      <div style={{
        backgroundColor: "#ffffff", borderBottom: "1px solid #E5E7EB",
        padding: "0 24px", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10
      }}>
        <div style={{ fontWeight: 700, color: "#00B386", fontSize: "16px" }}>
          💰 SpendSense
        </div>
        <button onClick={() => navigate("/dashboard")} style={{
          fontSize: "12px", color: "#6B7280", border: "1px solid #E5E7EB",
          backgroundColor: "#ffffff", padding: "6px 12px",
          borderRadius: "8px", cursor: "pointer", fontWeight: 500
        }}>
          ← Back
        </button>
      </div>

      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>Analytics</h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
            Your spending breakdown
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#6B7280", padding: "60px" }}>Loading...</div>
        ) : expenses.length === 0 ? (
          <div style={{ textAlign: "center", color: "#6B7280", padding: "60px" }}>
            No expenses yet. Add some to see analytics!
          </div>
        ) : (
          <>
            {/* Summary */}
            <div style={{
              backgroundColor: "#00B386", borderRadius: "14px",
              padding: "24px", marginBottom: "20px", color: "white"
            }}>
              <div style={{ fontSize: "12px", opacity: 0.8, marginBottom: "6px" }}>Total Spending</div>
              <div style={{ fontSize: "32px", fontWeight: 700 }}>₹{total.toLocaleString()}</div>
              <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                across {expenses.length} transactions
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>

              {/* Pie Chart */}
              <div style={{
                backgroundColor: "#ffffff", borderRadius: "14px",
                border: "1px solid #E5E7EB", padding: "20px"
              }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", marginBottom: "16px" }}>
                  By Category
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div style={{ marginTop: "12px" }}>
                  {categoryData.map((item: any, i: number) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between",
                      alignItems: "center", marginBottom: "6px"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                          width: "8px", height: "8px", borderRadius: "50%",
                          backgroundColor: item.color
                        }} />
                        <span style={{ fontSize: "12px", color: "#6B7280" }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A1A2E" }}>
                        ₹{item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              <div style={{
                backgroundColor: "#ffffff", borderRadius: "14px",
                border: "1px solid #E5E7EB", padding: "20px"
              }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", marginBottom: "16px" }}>
                  Monthly Spending
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Spent"]} />
                    <Bar dataKey="amount" fill="#00B386" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Spending Categories */}
            <div style={{
              backgroundColor: "#ffffff", borderRadius: "14px",
              border: "1px solid #E5E7EB", padding: "20px"
            }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", marginBottom: "16px" }}>
                Top Categories
              </div>
              {categoryData.map((item: any, i: number) => (
                <div key={i} style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#1A1A2E", fontWeight: 500 }}>{item.name}</span>
                    <span style={{ fontSize: "12px", color: "#6B7280" }}>₹{item.value.toLocaleString()}</span>
                  </div>
                  <div style={{ backgroundColor: "#F3F4F6", borderRadius: "4px", height: "6px" }}>
                    <div style={{
                      backgroundColor: item.color, borderRadius: "4px", height: "6px",
                      width: `${(item.value / total) * 100}%`
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}