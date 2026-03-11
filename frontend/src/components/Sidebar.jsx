import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "bi-speedometer2" },
  { to: "/player", label: "Player Search", icon: "bi-search" },
  { to: "/player/overview", label: "Player Analytics", icon: "bi-bar-chart" },
  { to: "/deck", label: "Deck Intelligence", icon: "bi-cards" },
  { to: "/compare", label: "Player Comparison", icon: "bi-people" },
  { to: "/admin/users", label: "Admin", icon: "bi-gear" },
];

export const Sidebar = ({ collapsed, onToggle }) => {
  const [open, setOpen] = useState(false);

  const toggleMobile = () => setOpen((prev) => !prev);

  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-link d-flex align-items-center gap-2 text-white active"
      : "nav-link d-flex align-items-center gap-2 text-muted";

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${open ? "open" : ""}`}>
      <div className="sidebar-head d-flex align-items-center justify-content-between px-3 py-3">
        <div className="d-flex align-items-center gap-2">
          <span className="bg-gradient rounded-circle p-2" style={{ background: "linear-gradient(120deg, #00bfff, #8a2be2)" }}>
            <i className="bi bi-shield-fill-check text-white fs-5"></i>
          </span>
          <div className="d-none d-md-block">
            <h5 className="mb-0">Clash Intel</h5>
            <small className="text-muted">Player Dashboard</small>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-light d-none d-md-inline"
            type="button"
            aria-label="Collapse sidebar"
            onClick={onToggle}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            type="button"
            aria-label="Toggle sidebar"
            onClick={toggleMobile}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>

      <nav className={`nav flex-column px-2 ${open ? "" : "d-none d-md-flex"}`}>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
            <i className={`bi ${item.icon} fs-5`} />
            <span className="d-none d-md-inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer mt-auto px-3 py-3 d-none d-md-block">
        <small className="text-muted">v1.0 • Dark mode</small>
      </div>
    </aside>
  );
};
