import React from "react";

export const Loader = ({ message = "Loading..." }) => (
  <div className="d-flex flex-column align-items-center justify-content-center p-5 text-center">
    <div className="spinner-border text-info" role="status" style={{ width: 52, height: 52 }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    <div className="mt-3 text-muted">{message}</div>
  </div>
);
