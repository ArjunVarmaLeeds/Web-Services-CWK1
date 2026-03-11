import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { ErrorAlert } from "../components/ErrorAlert";

export const Register = () => {
  const navigate = useNavigate();
  const { register, token } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await register(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 px-3">
      <div className="card p-4 shadow-lg" style={{ maxWidth: 420, width: "100%" }}>
        <h3 className="mb-3">Create an account</h3>
        <p className="text-muted mb-4">Get started with your Clash Royale analytics dashboard.</p>

        <ErrorAlert message={error} onClose={() => setError(null)} />

        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Confirm password</label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="text-center text-muted">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};
