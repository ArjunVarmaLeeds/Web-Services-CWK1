import React from "react";

export const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-danger d-flex align-items-start gap-2" role="alert">
      <i className="bi bi-exclamation-triangle-fill fs-4"></i>
      <div className="flex-grow-1">
        <strong>Oops!</strong> {message}
      </div>
      {onClose ? (
        <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={onClose}></button>
      ) : null}
    </div>
  );
};
