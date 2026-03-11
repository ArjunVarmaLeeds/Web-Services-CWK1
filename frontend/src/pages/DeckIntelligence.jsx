import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { players } from "../services/api";
import { Loader } from "../components/Loader";
import { ErrorAlert } from "../components/ErrorAlert";
import { DeckCard } from "../components/DeckCard";
import { StatCard } from "../components/StatCard";

export const DeckIntelligence = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await players.cardIntelligence(tag);
        setData(res.data?.data ?? null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Unable to load deck intelligence.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [tag]);

  const rarityChips = (rarityMap = {}) => {
    const items = Object.entries(rarityMap);
    if (!items.length) return null;

    return (
      <div className="d-flex flex-wrap gap-2">
        {items.map(([rarity, value]) => (
          <div
            key={rarity}
            className="badge bg-secondary text-white px-3 py-2"
            style={{ opacity: 0.9 }}
          >
            {rarity} <span className="text-muted">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const deck = data?.deck;
  const cards = deck?.cards ?? [];

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1">Deck Intelligence</h2>
          <p className="text-muted mb-0">Understand what makes your deck effective and where to improve.</p>
        </div>
        <button className="btn btn-outline-light" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-short me-2"></i> Back
        </button>
      </div>

      {loading ? (
        <Loader message="Loading deck analysis..." />
      ) : (
        <>
          {error ? <ErrorAlert message={error} onClose={() => setError(null)} /> : null}
          {data ? (
            <div className="row g-3">
              <div className="col-xl-7">
                <div className="card p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h5 className="mb-1 text-white">Current deck</h5>
                      <small className="text-muted">Tap a card to inspect details</small>
                    </div>
                    <span className="badge bg-dark text-white">{deck?.type || "Unknown archetype"}</span>
                  </div>
                  <div className="row g-3">
                    {cards.length > 0 ? (
                      cards.map((card) => (
                        <div key={card.id || card.name} className="col-6 col-sm-4 col-md-3 text-white">
                          <DeckCard card={card} />
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <p className="text-muted">No deck cards available for this player.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-xl-5">
                <div className="row g-3">
                  <div className="col-12">
                    <StatCard
                      title="Average elixir"
                      value={deck?.averageElixir ?? "—"}
                      icon="bi-lightning-fill"
                      accent="blue"
                      hint="Lower is faster cycle"
                    />
                  </div>
                  <div className="col-12">
                    <StatCard
                      title="Cycle cards"
                      value={deck?.cycleCardCount ?? "—"}
                      icon="bi-arrow-repeat"
                      accent="primary"
                      hint="Cards that help you cycle quickly"
                    />
                  </div>
                  <div className="col-12">
                    <StatCard
                      title="Rarity distribution"
                      value={""}
                      icon="bi-diagram-3"
                      accent="gold"
                    >
                      {rarityChips(deck?.rarityDistribution)}
                    </StatCard>
                  </div>
                  <div className="col-12">
                    <div className="card p-3">
                      <h6 className="text-uppercase text-muted mb-3">Progression</h6>
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Average card level</span>
                          <span className="fw-semibold text-white">{data.progression?.averageCardLevel ?? "—"}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-muted">Total cards owned</span>
                          <span className="fw-semibold text-white">{data.progression?.totalCardsOwned ?? "—"}</span>
                        </div>
                        <StatCard
                          title="Most upgraded card"
                          value={data.progression?.mostUpgradedCard?.name ?? "—"}
                          imageUrl={data.progression?.mostUpgradedCard?.iconUrl}
                          accent="gold"
                          className="mb-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-5 text-center">
              <p className="text-muted mb-0">No deck intelligence data available.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
