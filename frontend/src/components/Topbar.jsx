import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export const Topbar = ({ onSearch }) => {
  const { user, logout, sessions, currentEmail, switchAccount } = useAuth();
  const [tag, setTag] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = tag.trim();
    if (!value) return;
    const normalized = value.startsWith("#") ? value : `#${value}`;
    const encoded = encodeURIComponent(normalized);
    navigate(`/player/${encoded}`);
    if (onSearch) onSearch(normalized);
    setTag("");
  };

  return (
    <header className="topbar d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
      <form className="d-flex align-items-center gap-2 w-100" onSubmit={handleSearch}>
        <div className="input-group input-group-sm w-100">
          <span className="input-group-text bg-secondary border-secondary text-white">
            <i className="bi bi-search"></i>
          </span>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="form-control border-secondary bg-transparent text-white"
            style={{ color: "white" }}
            placeholder="Search player tag (e.g. #20RGGRCJJ9)"
            aria-label="Player tag"
          />
          <button className="btn btn-primary" type="submit">
            Go
          </button>
        </div>
      </form>

      <div className="d-flex align-items-center gap-3 ms-3">
        <div className="d-none d-sm-flex align-items-center gap-2">
          <span className="badge bg-dark text-muted px-3 py-2">
            <i className="bi bi-moon-stars-fill me-2"></i> Dark Mode
          </span>
        </div>

        <div className="dropdown" ref={dropdownRef}>
          <button
            className="btn btn-sm btn-outline-light dropdown-toggle"
            type="button"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <i className="bi bi-person-circle me-1"></i>
            <span className="d-none d-md-inline">{user?.email ?? "Guest"}</span>
          </button>
          <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-dark ${dropdownOpen ? "show" : ""}`}>
            <li className="dropdown-header">Accounts</li>
            {Object.entries(sessions || {}).length === 0 ? (
              <li className="dropdown-item text-muted">No saved accounts</li>
            ) : (
              Object.entries(sessions).map(([email]) => (
                <li key={email}>
                  <button
                    className={`dropdown-item d-flex justify-content-between align-items-center ${
                      email === currentEmail ? "active" : ""
                    }`}
                    type="button"
                    onClick={() => {
                      switchAccount(email);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{email}</span>
                    {email === currentEmail ? <small className="badge bg-info">Active</small> : null}
                  </button>
                </li>
              ))
            )}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  navigate("/admin/users");
                  setDropdownOpen(false);
                }}
              >
                <i className="bi bi-gear me-2"></i> User Management
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item text-danger"
                type="button"
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
