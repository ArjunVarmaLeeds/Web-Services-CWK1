import React, { useState } from "react";

const rarityColors = {
  Common: "rgba(255,255,255,0.12)",
  Rare: "rgba(0, 191, 255, 0.25)",
  Epic: "rgba(138, 43, 226, 0.25)",
  Legendary: "rgba(255, 215, 0, 0.25)",
  Champion: "rgba(255, 126, 0, 0.3)",
};

export const DeckCard = ({ card }) => {
  const [showDetails, setShowDetails] = useState(false);
  const rarity = card.rarity || card.rarityName || "Common";

  return (
    <>
      <div
        className="card p-3 h-100"
        style={{
          borderColor: rarityColors[rarity] || "rgba(255,255,255,0.1)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <div className="d-flex align-items-start justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            {card.iconUrl ? (
              <img
                src={card.iconUrl}
                alt={`${card.name} icon`}
                className="rounded"
                style={{ width: 56, height: 56, objectFit: "contain" }}
              />
            ) : null}
            <div>
              <h6 className="mb-1 text-white">{card.name}</h6>
              {card.elixir != null ? (
                <div className="text-muted small">Elixir: {card.elixir}</div>
              ) : null}
            </div>
          </div>
          <span
            className="badge text-white"
            style={{ background: rarityColors[rarity] || "rgba(255,255,255,0.1)" }}
          >
            {rarity}
          </span>
        </div>
        <div className="d-flex align-items-center justify-content-between mt-auto pt-2 border-top border-white/10">
          <div className="text-muted small">Level {card.level ?? "—"}</div>
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={() => setShowDetails(true)}
          >
            View
          </button>
        </div>
      </div>

      {showDetails ? (
        <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header">
                <div className="d-flex align-items-center gap-2">
                  {card.iconUrl ? (
                    <img
                      src={card.iconUrl}
                      alt={`${card.name} icon`}
                      className="rounded"
                      style={{ width: 48, height: 48, objectFit: "contain" }}
                    />
                  ) : null}
                  <h5 className="modal-title mb-0">{card.name}</h5>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => setShowDetails(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-2">
                  <strong>Rarity:</strong> {rarity}
                </div>
                {card.elixir != null ? (
                  <div className="mb-2">
                    <strong>Elixir:</strong> {card.elixir}
                  </div>
                ) : null}
                <div className="mb-2">
                  <strong>Level:</strong> {card.level ?? "—"}
                </div>
                {card.description ? (
                  <div className="mb-2">
                    <strong>Description:</strong> {card.description}
                  </div>
                ) : null}
                {card.arena ? (
                  <div className="mb-2">
                    <strong>Arena:</strong> {card.arena}
                  </div>
                ) : null}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-light"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            onClick={() => setShowDetails(false)}
          />
        </div>
      ) : null}
    </>
  );
};
