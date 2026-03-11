import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const PlayerSearch = () => {
  const navigate = useNavigate();
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!tag.trim()) return;
    const normalized = tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`;
    navigate(`/player/${encodeURIComponent(normalized)}`);
  };

  return (
    <div className="container-fluid py-4">
      <div className="card p-4">
        <h2 className="mb-3 text-white">Player Search</h2>
        <p className="text-muted mb-4">Enter a Clash Royale player tag (e.g. #20RGGRCJJ9) to load analytics.</p>
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-8">
            <input
              className="form-control form-control-lg bg-white"
              style={{ color: "#0b0d12" }}
              value={tag}
              placeholder="#PLAYER_TAG"
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid">
            <button className="btn btn-primary btn-lg" type="submit">
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
