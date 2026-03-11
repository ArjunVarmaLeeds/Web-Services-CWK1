import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { players } from "../services/api";
import { StatCard } from "../components/StatCard";
import { Loader } from "../components/Loader";
import { ErrorAlert } from "../components/ErrorAlert";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [tag, setTag] = useLocalStorage("clash-intel-last-tag", "");
  const [overview, setOverview] = useState(null);
  const [playstyle, setPlaystyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (playerTag) => {
    setError(null);
    setLoading(true);
    try {
      const [o, p] = await Promise.all([
        players.overview(playerTag),
        players.playstyle(playerTag),
      ]);
      setOverview(o.data?.data ?? null);
      setPlaystyle(p.data?.data ?? null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to load player data.");
      setOverview(null);
      setPlaystyle(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tag) {
      fetchData(tag);
    }
  }, [tag]);

  const handleSearch = (value) => {
    const normalized = value.startsWith("#") ? value : `#${value}`;
    setTag(normalized);
    navigate(`/player/${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Quick overview of your last searched player stats.</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-light"
            onClick={() => {
              const player = prompt("Enter player tag (e.g. #20RGGRCJJ9):", tag || "");
              if (player) handleSearch(player);
            }}
          >
            <i className="bi bi-search me-2"></i>
            Search player
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => {
              setTag("");
              setOverview(null);
              setPlaystyle(null);
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading player analytics..." />
      ) : (
        <>
          {error ? <ErrorAlert message={error} onClose={() => setError(null)} /> : null}
          {!tag ? (
            <div className="card p-5 text-center">
              <h4 className="mb-2 text-muted">Get started by searching a player tag.</h4>
              <p className="text-secondary">Use the search bar or hit the Search player button.</p>
            </div>
          ) : (
            <>
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <StatCard
                    title="Total trophies"
                    value={overview?.trophies ?? "—"}
                    icon="bi-award"
                    accent="gold"
                    hint={overview ? "Current" : ""}
                  />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title="Best trophies"
                    value={overview?.bestTrophies ?? "—"}
                    icon="bi-trophy"
                    accent="purple"
                    hint={overview ? "All time" : ""}
                  />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title="Win rate"
                    value={overview ? `${Math.round(overview.winRate * 100)}%` : "—"}
                    icon="bi-percent"
                    accent="success"
                    hint={overview ? "Last 30 days" : ""}
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <StatCard
                    title="Aggression score"
                    value={playstyle?.aggressionScore ? playstyle.aggressionScore.toFixed(1) : "—"}
                    icon="bi-lightning-fill"
                    accent="danger"
                    hint={playstyle ? "Higher is more aggressive" : ""}
                  />
                </div>
                <div className="col-md-4">
                  <StatCard
                    title="Playstyle"
                    value={playstyle?.playstyle ?? "—"}
                    icon="bi-ui-checks"
                    accent="primary"
                    hint={playstyle ? "Detected from recent battles" : ""}
                  >
                    {playstyle ? (
                      <p className="text-muted small mb-0">
                        {playstyle.playstyle === "AGGRO" &&
                          "Aggressive players push for early advantages and aim for quick finishing combos."}
                        {playstyle.playstyle === "CONTROL" &&
                          "Control players value defense and counter pushes over raw tempo."}
                        {playstyle.playstyle === "BALANCED" &&
                          "Balanced players adapt to the matchup and mix offense with defense."}
                      </p>
                    ) : null}
                  </StatCard>
                </div>
                <div className="col-md-4">
                  <div className="card p-3 h-100">
                    <h6 className="text-uppercase text-muted mb-2">Next steps</h6>
                    <ul className="list-unstyled mb-0 text-muted">
                      <li className="mb-2">
                        <i className="bi bi-arrow-right-short me-2"></i>
                        Review the <strong>Deck Intelligence</strong> for card insights.
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-arrow-right-short me-2"></i>
                        Compare with another player from the <strong>Comparison</strong> page.
                      </li>
                      <li>
                        <i className="bi bi-arrow-right-short me-2"></i>
                        Use the <strong>Player Search</strong> shortcut button above.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
