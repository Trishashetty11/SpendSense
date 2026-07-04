import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export default function AddExpense() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recurring, setRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/expenses", {
        title, amount: parseFloat(amount),
        date, description, categoryId, recurring
      });
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to add expense. Try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <div style={{ padding: "24px", maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>
            Add Expense
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
            Track a new expense
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#FEF2F2", color: "#DC2626",
            padding: "10px 14px", borderRadius: "8px",
            fontSize: "13px", marginBottom: "16px"
          }}>
            {error}
          </div>
        )}

        <div style={{
          backgroundColor: "#ffffff", borderRadius: "14px",
          border: "1px solid #E5E7EB", padding: "24px"
        }}>
          <form onSubmit={handleSubmit}>

            {/* Title */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lunch, Uber, Netflix"
                required
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", color: "#1A1A2E", outline: "none",
                  backgroundColor: "#FAFAFA", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Amount */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", color: "#1A1A2E", outline: "none",
                  backgroundColor: "#FAFAFA", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Date */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", color: "#1A1A2E", outline: "none",
                  backgroundColor: "#FAFAFA", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Category */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", display: "block", marginBottom: "8px" }}>
                Category
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    style={{
                      padding: "6px 14px", borderRadius: "20px",
                      fontSize: "12px", fontWeight: 500, cursor: "pointer",
                      border: categoryId === cat.id ? `2px solid ${cat.color}` : "1.5px solid #E5E7EB",
                      backgroundColor: categoryId === cat.id ? cat.color + "15" : "#ffffff",
                      color: categoryId === cat.id ? cat.color : "#6B7280"
                    }}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "#6B7280", display: "block", marginBottom: "6px" }}>
                Note (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note..."
                style={{
                  width: "100%", padding: "11px 14px",
                  border: "1.5px solid #E5E7EB", borderRadius: "10px",
                  fontSize: "14px", color: "#1A1A2E", outline: "none",
                  backgroundColor: "#FAFAFA", boxSizing: "border-box"
                }}
              />
            </div>

            {/* Recurring */}
            <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                id="recurring"
                checked={recurring}
                onChange={(e) => setRecurring(e.target.checked)}
                style={{ width: "16px", height: "16px", accentColor: "#00B386" }}
              />
              <label htmlFor="recurring" style={{ fontSize: "13px", color: "#6B7280", cursor: "pointer" }}>
                Recurring expense
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                backgroundColor: loading ? "#9CA3AF" : "#00B386",
                color: "white", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: 600, cursor: "pointer"
              }}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}