import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("name", res.data.name);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8FAF8" }}>
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16"
        style={{ backgroundColor: "#00B386" }}>
        <div className="text-white">
          <div className="text-2xl font-bold mb-2">💰 SpendSense</div>
          <h2 className="text-4xl font-semibold leading-tight mb-4">
            Track smarter,<br />spend better.
          </h2>
          <p style={{ color: "#d1fae5" }} className="text-sm">
            Your personal finance companion for a healthier wallet.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="text-xl font-bold md:hidden mb-6"
              style={{ color: "#00B386" }}>💰 SpendSense</div>
            <h1 className="text-2xl font-semibold" style={{ color: "#1A1A2E" }}>
              Welcome back
            </h1>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              Login to continue
            </p>
          </div>

          {error && (
            <div className="text-sm px-4 py-3 rounded-xl mb-4"
              style={{ backgroundColor: "#FEE2E2", color: "#EF4444" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium block mb-1"
                style={{ color: "#6B7280" }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#1A1A2E"
                }}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1"
                style={{ color: "#6B7280" }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#1A1A2E"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition"
              style={{ backgroundColor: loading ? "#6B7280" : "#00B386" }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
            Don't have an account?{" "}
            <Link to="/register"
              className="font-semibold" style={{ color: "#00B386" }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}