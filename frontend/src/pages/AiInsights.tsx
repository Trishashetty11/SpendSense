import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AiInsights() {
  const [insights, setInsights] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/ai/insights");
      setInsights(res.data.insights);
    } catch (err) {
      setInsights("Failed to get insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatInsights = (text: string) => {
    return text.split("\n").filter(line => line.trim() !== "");
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

      <div style={{ padding: "24px", maxWidth: "700px", margin: "0 auto" }}>

        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "18px", fontWeight: 700, color: "#1A1A2E" }}>
            AI Insights
          </h1>
          <p style={{ fontSize: "13px", color: "#6B7280", marginTop: "4px" }}>
            Smart analysis of your spending powered by Gemini AI
          </p>
        </div>

        {/* CTA Card */}
        <div style={{
          backgroundColor: "#ffffff", borderRadius: "14px",
          border: "1px solid #E5E7EB", padding: "24px",
          marginBottom: "20px", textAlign: "center"
        }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>🤖</div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1A1A2E", marginBottom: "6px" }}>
            Get personalized spending insights
          </div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "20px" }}>
            Gemini AI will analyze your expenses and suggest ways to save money
          </div>
          <button
            onClick={getInsights}
            disabled={loading}
            style={{
              backgroundColor: loading ? "#9CA3AF" : "#00B386",
              color: "white", border: "none", borderRadius: "10px",
              padding: "10px 24px", fontSize: "13px",
              fontWeight: 600, cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Analyzing your expenses..." : "Generate Insights"}
          </button>
        </div>

        {/* Insights Result */}
        {insights && (
          <div style={{
            backgroundColor: "#ffffff", borderRadius: "14px",
            border: "1px solid #E5E7EB", padding: "24px"
          }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#1A1A2E", marginBottom: "16px" }}>
              Your Spending Analysis
            </div>
            {formatInsights(insights).map((line, i) => (
              <div key={i} style={{
                padding: "12px 16px", borderRadius: "10px",
                backgroundColor: "#F8FAF8", marginBottom: "8px",
                fontSize: "13px", color: "#1A1A2E", lineHeight: 1.6,
                borderLeft: "3px solid #00B386"
              }}>
                {line.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^[-•]\s/, "")}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}