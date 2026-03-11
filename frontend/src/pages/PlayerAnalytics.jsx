import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { players } from "../services/api";
import { Loader } from "../components/Loader";
import { ErrorAlert } from "../components/ErrorAlert";
import { StatCard } from "../components/StatCard";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export const PlayerAnalytics = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [overview, setOverview] = useState(null);
  const [playstyle, setPlaystyle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setError(null);
      setLoading(true);
      try {
        const [p, o, ps] = await Promise.all([
          players.profile(tag),
          players.overview(tag),
          players.playstyle(tag),
        ]);

        setProfile(p.data?.player ?? null);
        setOverview(o.data?.data ?? null);
        setPlaystyle(ps.data?.data ?? null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Failed to load player analytics.");
        setProfile(null);
        setOverview(null);
        setPlaystyle(null);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [tag]);

  const winLossData = useMemo(() => {
    if (!profile) return null;
    const wins = profile.wins ?? 0;
    const losses = profile.losses ?? 0;
    const total = wins + losses;
    return {
      labels: ["Wins", "Losses"],
      datasets: [
        {
          data: [wins, losses],
          backgroundColor: ["rgba(41, 163, 255, 0.85)", "rgba(255, 81, 81, 0.85)"],
          borderWidth: 0,
        },
      ],
    };
  }, [profile]);

  const winRate = overview ? Math.round(overview.winRate * 100) : null;

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Player Analytics</h2>
          <p className="text-muted mb-0">Deep dive into player performance and playstyle.</p>
        </div>
        <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-short me-2"></i> Back
        </button>
      </div>

      {loading ? (
        <Loader message="Loading player analytics..." />
      ) : (
        <>
          {error ? <ErrorAlert message={error} onClose={() => setError(null)} /> : null}
          {profile ? (
            <div className="row gy-3">
              <div className="col-xl-4">
                <div className="card p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="mb-1 text-white">{profile.name || "Unknown"}</h5>
                      <small className="text-muted">{profile.tag}</small>
                    </div>
                    <span className="badge bg-secondary text-white">{profile.arena}</span>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <StatCard title="Trophies" value={profile.trophies} icon="bi-award" accent="gold" className="mb-0" />
                    </div>
                    <div className="col-6">
                      <StatCard title="Best" value={profile.bestTrophies} icon="bi-trophy" accent="purple" className="mb-0" />
                    </div>
                    <div className="col-6">
                      <StatCard title="Wins" value={profile.wins} icon="bi-check-circle" accent="success" className="mb-0" />
                    </div>
                    <div className="col-6">
                      <StatCard title="Losses" value={profile.losses} icon="bi-x-circle" accent="danger" className="mb-0" />
                    </div>
                  </div>
                </div>

                <div className="card p-4 mt-3">
                  <h6 className="text-uppercase text-muted mb-3">Win / loss split</h6>
                  {winLossData ? (
                    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 220 }}>
                      <Doughnut data={winLossData} options={{ plugins: { legend: { position: "bottom" } } }} />
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No battle records available.</p>
                  )}
                </div>
              </div>

              <div className="col-xl-8">
                <div className="row g-3">
                  <div className="col-md-6">
                    <StatCard
                      title="Win rate"
                      value={winRate != null ? `${winRate}%` : "—"}
                      icon="bi-percent"
                      accent="success"
                      hint={overview ? "Recent" : ""}
                    />
                  </div>
                  <div className="col-md-6">
                    <StatCard
                      title="Playstyle"
                      value={playstyle?.playstyle ?? "—"}
                      icon="bi-ui-checks"
                      accent="primary"
                      hint={playstyle ? `Based on ${playstyle.totalBattles ?? 0} battles` : ""}
                    >
                      {playstyle ? (
                        <p className="text-muted small mb-0">
                          {playstyle.playstyle === "AGGRO" &&
                            "Your recent games suggest you prioritise early pressure and fast finishes."}
                          {playstyle.playstyle === "CONTROL" &&
                            "Your games trend toward patient defence and calculated counter-plays."}
                          {playstyle.playstyle === "BALANCED" &&
                            "Your profile shows a mix of offense and defense, adapting to the matchup."}
                        </p>
                      ) : null}
                    </StatCard>
                  </div>
                </div>

                <div className="card p-4 mt-3">
                  <h5 className="mb-3 text-white">Player Summary</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="text-muted small">Favourite card</div>
                        <div className="fw-semibold text-white">
                          {profile.favouriteCardName ?? profile.favouriteCard ?? profile.favourite_card ?? "N/A"}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-muted small">Account created</div>
                        <div className="fw-semibold text-white">{new Date(profile.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <div className="text-muted small">Trophy range</div>
                        <div className="fw-semibold text-white">
                          {profile.trophies} — {profile.bestTrophies}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="text-muted small">Aggression score</div>
                        <div className="fw-semibold text-white">
                          {playstyle?.aggressionScore ? playstyle.aggressionScore.toFixed(1) : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row flex-wrap gap-3 mt-3">
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate(`/deck/${encodeURIComponent(tag)}`)}
                  >
                    Deck Intelligence
                  </button>
                  <button
                    className="btn btn-outline-light"
                    onClick={() => navigate(`/compare?tag1=${encodeURIComponent(tag)}`)}
                  >
                    Compare player
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <p className="text-muted mb-0">Player not found or data is unavailable.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
