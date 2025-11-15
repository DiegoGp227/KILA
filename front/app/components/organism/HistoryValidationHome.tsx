"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRecentValidations, StoredValidation } from "@/app/services/localStorage.service";

export default function HistoryValidationHome() {
  const router = useRouter();
  const [validations, setValidations] = useState<StoredValidation[]>([]);

  useEffect(() => {
    // Load recent validations from localStorage
    const recent = getRecentValidations(5);
    setValidations(recent);
  }, []);

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "approved":
        return { icon: "✓", class: "success" };
      case "rejected":
        return { icon: "✕", class: "error" };
      case "warning":
        return { icon: "⚠", class: "warning" };
      default:
        return { icon: "?", class: "pending" };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    } else {
      return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    }
  };

  if (validations.length === 0) {
    return (
      <div className="text-center text-muted" style={{ padding: "2rem" }}>
        <p>No hay validaciones recientes</p>
        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
          Sube tu primer archivo JSON para comenzar
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {validations.map((validation) => {
        const statusDisplay = getStatusDisplay(validation.status);
        return (
          <div
            key={validation.id}
            className="card"
            style={{ padding: "1rem", cursor: "pointer" }}
            onClick={() => router.push(`/validation/results?id=${validation.id}`)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div className={`status-icon ${statusDisplay.class}`}>
                  {statusDisplay.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: "white" }}>
                    {validation.filename}
                  </div>
                  <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                    {formatTimestamp(validation.timestamp)} •
                    {validation.errors.length > 0
                      ? ` ${validation.errors.length} error${validation.errors.length > 1 ? 'es' : ''}`
                      : validation.warnings.length > 0
                      ? ` ${validation.warnings.length} advertencia${validation.warnings.length > 1 ? 's' : ''}`
                      : ' Validación exitosa'}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/validation/results?id=${validation.id}`);
                }}
              >
                <span>→</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
