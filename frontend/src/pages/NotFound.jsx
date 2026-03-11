import React from "react";
import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-100 px-3">
    <div className="text-center">
      <h1 className="display-4">404</h1>
      <p className="lead text-muted">Page not found.</p>
      <Link to="/" className="btn btn-primary">
        Go to dashboard
      </Link>
    </div>
  </div>
);
