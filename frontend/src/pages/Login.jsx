import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { ErrorAlert } from "../components/ErrorAlert";

export const Login = () => {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="card p-4 shadow-lg" style={{ maxWidth: 420, width: "100%" }}>
        <h3 className="mb-3 text-white">Welcome back</h3>
        <p className="text-muted mb-4">Login to access the Clash Royale Intelligence dashboard.</p>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-3">
            <label className="form-label text-white">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3 text-white">
            <label className="form-label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <div className="text-center text-muted">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};
