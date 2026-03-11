import React from "react";
import clsx from "clsx";

export const StatCard = ({
  title,
  value,
  hint,
  icon,
  imageUrl,
  accent = "primary",
  children,
  className,
}) => {
  const color = {
    primary: "text-info",
    gold: "text-warning",
    purple: "text-purple",
    success: "text-success",
    danger: "text-danger",
  }[accent];

  return (
    <div className={clsx("card p-3 h-100", className)}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="d-flex align-items-center gap-2">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="rounded"
              style={{ width: 56, height: 56, objectFit: "contain" }}
            />
          ) : icon ? (
            <div className={clsx("icon-wrapper rounded-3 p-2", color)}>
              <i className={`bi ${icon} fs-4`}></i>
            </div>
          ) : null}
          <div>
            <h6 className="text-uppercase text-muted mb-1">{title}</h6>
            <div className="d-flex align-items-baseline gap-2">
              <span className={clsx("fs-3 fw-bold text-white", color)}>{value}</span>
              {hint ? <span className="text-muted small">{hint}</span> : null}
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
