import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { players } from "../services/api";
import { Loader } from "../components/Loader";
import { ErrorAlert } from "../components/ErrorAlert";

const highlight = (value, better) => {
  const className = better ? "text-success" : "text-danger";
  return <span className={className}>{value}</span>;
};

export const Comparison = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTag1 = searchParams.get("tag1") || "";
  const initialTag2 = searchParams.get("tag2") || "";
  const [tag1, setTag1] = useState(initialTag1);
  const [tag2, setTag2] = useState(initialTag2);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadComparison = async (t1, t2) => {
    setError(null);
    setLoading(true);
    try {
      const { data } = await players.compare(t1, t2);
      setResult(data?.data ?? null);
      navigate(`/compare?tag1=${encodeURIComponent(t1)}&tag2=${encodeURIComponent(t2)}`);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Comparison failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag1 || !tag2) return;
    loadComparison(tag1, tag2);
  };

  const compareStat = (a, b) => {
    if (a === b) return 0;
    return a > b ? 1 : -1;
  };

  const deckAdvantage = result?.comparison?.deckAdvantage;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Player Comparison</h2>
          <p className="text-muted mb-0">Side-by-side breakdown of two players.</p>
        </div>
      </div>

      <form className="row g-3 align-items-end mb-4" onSubmit={handleSubmit}>
        <div className="col-sm-5">
          <label className="form-label">Player 1 tag</label>
          <input
            className="form-control form-control-lg bg-white"
            style={{ color: "#0b0d12" }}
            value={tag1}
            onChange={(e) => setTag1(e.target.value)}
            placeholder="#PLAYER1"
          />
        </div>
        <div className="col-sm-5">
          <label className="form-label">Player 2 tag</label>
          <input
            className="form-control form-control-lg bg-white"
            style={{ color: "#0b0d12" }}
            value={tag2}
            onChange={(e) => setTag2(e.target.value)}
            placeholder="#PLAYER2"
          />
        </div>
        <div className="col-sm-2 d-grid">
          <button className="btn btn-primary" type="submit" disabled={loading || !tag1 || !tag2}>
            Compare
          </button>
        </div>
      </form>

      {loading ? (
        <Loader message="Comparing players..." />
      ) : (
        <>
          {error ? <ErrorAlert message={error} onClose={() => setError(null)} /> : null}
          {result ? (
            <div className="row g-3">
              <div className="col-lg-6">
                <div className="card p-4 h-100">
                  <h5 className="mb-3 text-white">{result.player1?.name || "Player 1"}</h5>
                  <div className="mb-3 text-white">
                    <span className="text-muted">Tag:</span> {result.player1?.tag}
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-muted small">Trophies</div>
                      {highlight(result.player1?.trophies, result.comparison?.trophies === "player1")}
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Win rate</div>
                      {highlight(`${Math.round((result.player1?.winRate ?? 0) * 100)}%`, result.comparison?.winRate === "player1")}
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Aggression</div>
                      {highlight(result.player1?.aggression, result.comparison?.aggression === "player1")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card p-4 h-100">
                  <h5 className="mb-3 text-white">{result.player2?.name || "Player 2"}</h5>
                  <div className="mb-3 text-white">
                    <span className="text-muted">Tag:</span> {result.player2?.tag}
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <div className="text-muted small">Trophies</div>
                      {highlight(result.player2?.trophies, result.comparison?.trophies === "player2")}
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Win rate</div>
                      {highlight(`${Math.round((result.player2?.winRate ?? 0) * 100)}%`, result.comparison?.winRate === "player2")}
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Aggression</div>
                      {highlight(result.player2?.aggression, result.comparison?.aggression === "player2")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12">
                <div className="card p-4 bg-dark border-secondary">
                  <h5 className="mb-3 text-white">Comparison summary</h5>
                  <div className="row">
                    <div className="col-sm-6 mb-3">
                      <div className="text-muted small">Better overall</div>
                      <div className="fs-5 fw-semibold text-white">
                        {result.comparison?.winRate === "player1" ? result.player1?.name : result.player2?.name}
                      </div>
                    </div>
                    <div className="col-sm-6 mb-3">
                      <div className="text-muted small">Suggested focus</div>
                      <div className="fs-5 fw-semibold text-white">
                        {deckAdvantage
                          ? `${deckAdvantage} has a better deck match-up`
                          : "No deck advantage data"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <p className="text-muted mb-0">Start a comparison by entering two player tags.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
